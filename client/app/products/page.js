import ProductTable from './producttable';

export default async function Home() {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/products', { next: { revalidate: 10 }})
    const data = await res.json();
    const productlist = data.products

    return <main><ProductTable products={productlist}/></main>
}
