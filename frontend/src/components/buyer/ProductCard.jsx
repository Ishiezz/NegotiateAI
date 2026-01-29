export function ProductCard({ product }) {
  return (
    <article>
      <h2>{product?.title ?? "Product title"}</h2>
      <p>{product?.category ?? "Category"}</p>
    </article>
  );
}
