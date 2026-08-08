import { create } from "zustand";
import { persist, type PersistStorage } from "zustand/middleware";
import type { Product, Lang } from "../types/catalog";
import { seedProduct } from "../lib/seed";
import { storage } from "../lib/storage";

/* ------------------------------------------------------------------ */
/*  Persist adapter bridging our debounced storage to zustand          */
/* ------------------------------------------------------------------ */

/** The slice of state that is actually persisted. */
export interface PersistedState {
  products: Product[];
  activeId: string;
  lang: Lang;
  templateIds: Record<string, string>;
}

const persistStorage: PersistStorage<PersistedState> = {
  getItem: (_name) => {
    const raw = storage.read();
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as {
        state?: PersistedState;
        version?: number;
      };
      return {
        state: parsed.state ?? ({} as PersistedState),
        version: parsed.version ?? 0,
      };
    } catch {
      return null;
    }
  },

  setItem: (_name, value) => {
    storage.write(JSON.stringify(value));
  },
  removeItem: (_name) => {
    storage.write("");
  },
};

/* ------------------------------------------------------------------ */
/*  Catalog store                                                      */
/* ------------------------------------------------------------------ */

export interface CatalogState {
  /** All products in the catalog. */
  products: Product[];
  /** Currently active product id. */
  activeId: string;
  /** Active UI language. */
  lang: Lang;
  /** Per-product template selection. */
  templateIds: Record<string, string>;

  /* actions */
  setLang(lang: Lang): void;
  setActive(id: string): void;
  setTemplateId(productId: string, templateId: string): void;
  updateProduct(id: string, patch: Partial<Product>): void;
  addProduct(product: Product): void;
  duplicateProduct(id: string): void;
  renameProduct(id: string, modelCode: string): void;
  deleteProduct(id: string): void;
  importProduct(product: Product): void;
}

function cloneProduct(product: Product): Product {
  return JSON.parse(JSON.stringify(product)) as Product;
}

export const useCatalog = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: [seedProduct],
      activeId: seedProduct.modelCode,
      lang: "en",
      templateIds: { [seedProduct.modelCode]: seedProduct.templateId },

      setLang(lang) {
        set({ lang });
      },

      setActive(id) {
        set({ activeId: id });
      },

      setTemplateId(productId, templateId) {
        set((state) => ({
          templateIds: { ...state.templateIds, [productId]: templateId },
          products: state.products.map((p) =>
            p.modelCode === productId ? { ...p, templateId } : p,
          ),
        }));
      },

      updateProduct(id, patch) {
        set((state) => ({
          products: state.products.map((p) =>
            p.modelCode === id ? { ...p, ...patch } : p,
          ),
        }));
      },

      addProduct(product) {
        set((state) => ({
          products: [...state.products, product],
          activeId: product.modelCode,
          templateIds: {
            ...state.templateIds,
            [product.modelCode]: product.templateId,
          },
        }));
      },

      duplicateProduct(id) {
        const source = get().products.find((p) => p.modelCode === id);
        if (!source) return;
        const copy = cloneProduct(source);
        copy.modelCode = `${source.modelCode} copy`;
        copy.templateId = source.templateId;
        set((state) => ({
          products: [...state.products, copy],
          activeId: copy.modelCode,
          templateIds: {
            ...state.templateIds,
            [copy.modelCode]: copy.templateId,
          },
        }));
      },

      renameProduct(id, modelCode) {
        const trimmed = modelCode.trim();
        if (!trimmed) return;
        set((state) => {
          const products = state.products.map((p) =>
            p.modelCode === id ? { ...p, modelCode: trimmed } : p,
          );
          const templateIds = { ...state.templateIds };
          if (templateIds[id] !== undefined) {
            templateIds[trimmed] = templateIds[id];
            delete templateIds[id];
          }
          return {
            products,
            templateIds,
            activeId: state.activeId === id ? trimmed : state.activeId,
          };
        });
      },

      deleteProduct(id) {
        set((state) => {
          if (state.products.length <= 1) return state;
          const products = state.products.filter((p) => p.modelCode !== id);
          const activeId =
            state.activeId === id ? products[0].modelCode : state.activeId;
          const templateIds = { ...state.templateIds };
          delete templateIds[id];
          return { products, activeId, templateIds };
        });
      },

      importProduct(product) {
        set((state) => {
          const exists = state.products.some(
            (p) => p.modelCode === product.modelCode,
          );
          if (exists) {
            return {
              products: state.products.map((p) =>
                p.modelCode === product.modelCode ? product : p,
              ),
              activeId: product.modelCode,
              templateIds: {
                ...state.templateIds,
                [product.modelCode]: product.templateId,
              },
            };
          }
          return {
            products: [...state.products, product],
            activeId: product.modelCode,
            templateIds: {
              ...state.templateIds,
              [product.modelCode]: product.templateId,
            },
          };
        });
      },
    }),
    {
      name: "catalog-studio-pro:v1",
      storage: persistStorage,
      partialize: (state) => ({
        products: state.products,
        activeId: state.activeId,
        lang: state.lang,
        templateIds: state.templateIds,
      }),
    },
  ),
);

/* ------------------------------------------------------------------ */
/*  Selectors                                                          */
/* ------------------------------------------------------------------ */

export function useActiveProduct(): Product | undefined {
  return useCatalog((s) => s.products.find((p) => p.modelCode === s.activeId));
}

export function useActiveTemplateId(): string {
  return useCatalog((s) => s.templateIds[s.activeId] ?? "classic");
}
