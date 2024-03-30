"use client";
import { getProducts } from "@/API/products";
import { Product, ProductSkeleton } from "@/components/product";
import { Accordion } from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ProductState } from "@/lib/validators";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, FilterIcon } from "lucide-react";
import { useState } from "react";

const SORT_OPTIONS = [
  { name: "None", value: "none" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
] as const;

const SUBCATEGORIES = [
  { name: "T-Shirts", selected: true, href: "#" },
  { name: "Hoodies", selected: false, href: "#" },
  { name: "Sweatshirts", selected: false, href: "#" },
  { name: "Accessories", selected: false, href: "#" },
] as const;

const COLOR_FILTERS = {
  id: "color",
  name: "Color",
  options: [
    { value: "white", label: "White" },
    { value: "biege", label: "Biege" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
  ] as const,
};

const SIZE_FILTERS = {
  id: "size",
  name: "Size",
  options: [
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
  ],
} as const;

const PRICE_FILTERS = {
  id: "price",
  name: "Price",
  options: [
    { value: [0, 100], label: "Any Price" },
    { value: [0, 20], label: "Under 20$" },
    { value: [0, 40], label: "Under 40$" },
    // custom option to be defined in JSX
  ],
} as const;

const DEFAULT_PRICE = [0, 100] as [number, number];

export default function Home() {
  const [filter, setFilter] = useState<ProductState>({
    color: ["biege", "white", "blue", "green", "purple"],
    sort: "none",
    price: { isCustom: false, range: DEFAULT_PRICE },
    size: ["L", "M", "S"],
  });

  const { data } = useQuery({
    queryKey: ["products"],
    // queryFn: async () => {
    //   const {data} = await axios.post<QueryResult<Product>[]>(`/api/products`, {
    //     filter: {
    //       sort: filter.sort
    //     }
    //   });
    //   return data
    // },
    queryFn: () => getProducts(filter),
  });

  const applyArrayFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filter, "price" | "sort">;
    value: string;
  }) => {
    const isFilterApplied = filter[category].includes(value as never);

    if (isFilterApplied) {
      setFilter((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value),
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
    }
  };

  const minPrice = Math.min(filter.price.range[0], filter.price.range[1]);
  const maxPrice = Math.max(filter.price.range[0], filter.price.range[1]);

  console.log(filter);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-300 pt-24 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          High Quality Cotton Collections
        </h1>

        <div className="flex items-center relative">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex gap-1 justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
              Filter
              <ChevronDown className="size-5 group-hover:text-gray-900" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilter((prev) => ({
                      ...prev,
                      sort: option.value,
                    }));
                  }}
                  className={cn("text-left w-full block px-4 py-2 text-sm", {
                    "text-gray-900 bg-gray-100": option.value === filter.sort,
                    "text-gray-500": option.value !== filter.sort,
                  })}
                >
                  {option.name}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="lg:hidden text-gray-400 hover:text-gray-500 -m-2 ml-4 p-2 sm:ml-6">
            <FilterIcon className="size-5" />
          </button>
        </div>
      </div>

      <section className="pb-24 pt-6">
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-x-8 gap-y-10">
          {/* Filters */}
          <div className="hidden lg:block sticky">
            <div className="space-y-4 border-b border-gray-300 pb-6 text-sm font-medium text-gray-900">
              {SUBCATEGORIES.map((cat) => (
                <div key={cat.name}>
                  <button
                    disabled={!cat.selected}
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {cat.name}
                  </button>
                </div>
              ))}
            </div>

            <Accordion type="multiple" className="w-full animate-none">
              {/* Color Filter */}
              <AccordionItem
                value="color"
                className="border-b border-gray-300 py-1"
              >
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Colors</span>
                </AccordionTrigger>
                <AccordionContent className="pt-3 animate-none">
                  <div className="space-y-4">
                    {COLOR_FILTERS.options.map((option, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          id={`color-${idx}`}
                          checked={filter.color.includes(option.value)}
                          className="size-4 rounded text-indigo-600 focus:ring-indigo-300"
                          onChange={() =>
                            applyArrayFilter({
                              category: "color",
                              value: option.value,
                            })
                          }
                        />
                        <label htmlFor={`color-${idx}`}>{option.label}</label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Size Filter */}
              <AccordionItem
                value="size"
                className="border-b border-gray-300 py-1"
              >
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Size</span>
                </AccordionTrigger>
                <AccordionContent className="pt-3 animate-none">
                  <div className="space-y-4">
                    {SIZE_FILTERS.options.map((option, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          id={`size-${idx}`}
                          checked={filter.size.includes(option.value)}
                          className="size-4 rounded text-indigo-600 focus:ring-indigo-300"
                          onChange={() =>
                            applyArrayFilter({
                              category: "size",
                              value: option.value,
                            })
                          }
                        />
                        <label htmlFor={`size-${idx}`}>{option.label}</label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Price Filter */}
              <AccordionItem
                value="price"
                className="border-b border-gray-300 py-1"
              >
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Price</span>
                </AccordionTrigger>
                <AccordionContent className="pt-3 animate-none">
                  <div className="space-y-4 pb-5">
                    {PRICE_FILTERS.options.map((option, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name="price"
                          id={`price-${idx}`}
                          checked={
                            !filter.price.isCustom &&
                            filter.price.range[0] === option.value[0] &&
                            filter.price.range[1] === option.value[1]
                          }
                          className="size-4 rounded text-indigo-600 focus:ring-indigo-300"
                          onChange={() =>
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...option.value],
                              },
                            }))
                          }
                        />
                        <label htmlFor={`price-${idx}`}>{option.label}</label>
                      </div>
                    ))}
                    {/* Custom Price Filter */}
                    <div className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="price"
                        id={`price-${PRICE_FILTERS.options.length}`}
                        checked={filter.price.isCustom}
                        className="size-4 rounded text-indigo-600 focus:ring-indigo-300"
                        onChange={() =>
                          setFilter((prev) => ({
                            ...prev,
                            price: {
                              isCustom: true,
                              range: [0, 100],
                            },
                          }))
                        }
                      />
                      <label htmlFor={`price-${PRICE_FILTERS.options.length}`}>
                        Custom
                      </label>
                    </div>

                    <div className="flex justify-between">
                      <p>Price</p>
                      <div>
                        {filter.price.isCustom
                          ? minPrice.toFixed(0)
                          : filter.price.range[0].toFixed(0)}{" "}
                        $ -{" "}
                        {filter.price.isCustom
                          ? maxPrice.toFixed(0)
                          : filter.price.range[1].toFixed(0)}{" "}
                        $
                      </div>
                    </div>
                    <Slider
                      disabled={!filter.price.isCustom}
                      className={cn("", {
                        "opacity-50": !filter.price.isCustom,
                      })}
                      onValueChange={(range) => {
                        const [min, max] = range;
                        setFilter((prev) => ({
                          ...prev,
                          price: {
                            isCustom: true,
                            range: [min, max],
                          },
                        }));
                      }}
                      value={
                        filter.price.isCustom
                          ? filter.price.range
                          : DEFAULT_PRICE
                      }
                      min={DEFAULT_PRICE[0]}
                      max={DEFAULT_PRICE[1]}
                      defaultValue={DEFAULT_PRICE}
                      step={5}
                    ></Slider>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Products */}
          <div className="grid lg:col-span-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
            {data
              ? data.map((prod: any) => (
                  <Product key={prod.id} product={prod.metadata!} />
                ))
              : new Array(12)
                  .fill(null)
                  .map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
