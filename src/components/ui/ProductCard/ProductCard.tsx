"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Flame, Sandwich, Salad, CupSoda } from "lucide-react";
import { Product } from "@/lib/mockData";
import { useShopStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

function tagVariant(tag: string): React.ComponentProps<typeof Badge>["variant"] {
  const t = tag.toLowerCase();
  if (t.includes("spicy") || t.includes("hot")) return "destructive";
  if (t.includes("best") || t.includes("new")) return "default";
  return "secondary";
}

function PlaceholderIcon({ id }: { id: string }) {
  const c = "size-10 text-primary/90";
  if (id.startsWith("b")) return <Sandwich className={c} strokeWidth={1.25} />;
  if (id.startsWith("s")) return <Salad className={c} strokeWidth={1.25} />;
  return <CupSoda className={c} strokeWidth={1.25} />;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useShopStore((state) => state.addItem);
  const setSelectedDrawerProduct = useShopStore((state) => state.setSelectedDrawerProduct);

  const p = product as Product & { basePrice?: number; imageUrl?: string };
  const unitPrice = Number(p.price ?? p.basePrice ?? 0);
  const imageUrl = p.imageUrl ?? (p as { image?: string }).image;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card
        size="sm"
        className={cn(
          "cursor-pointer gap-0 overflow-hidden py-0 transition-shadow hover:shadow-lg hover:shadow-primary/5 ring-border/60"
        )}
        onClick={() => setSelectedDrawerProduct(product)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelectedDrawerProduct(product);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/40">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
              priority={product.id.startsWith("b1")}
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-card">
              <PlaceholderIcon id={product.id} />
            </div>
          )}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.tags?.map((tag) => (
              <Badge key={tag} variant={tagVariant(tag)} className="text-[0.6rem] uppercase tracking-wide">
                {tag}
              </Badge>
            ))}
            {product.category === "burgers" && (
              <Badge variant="outline" className="border-primary/40 text-[0.6rem] uppercase tracking-wide text-primary">
                Customizable
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="space-y-2 pt-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-base font-semibold leading-snug text-foreground">{product.name}</h3>
            <span className="shrink-0 text-sm font-bold text-primary">${unitPrice.toFixed(2)}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        </CardContent>

        <CardFooter className="justify-between border-t border-border/50 bg-muted/20">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Flame className="size-3.5 text-primary/80" />
            <span>{product.calories != null ? `${product.calories} kcal` : "—"}</span>
          </div>
          <Button
            type="button"
            size="icon-sm"
            variant="default"
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              addItem(product);
            }}
            aria-label={`Add ${product.name} to bag`}
          >
            <Plus className="size-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
