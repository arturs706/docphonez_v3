import ProductTable from './producttable';


export default async function Home({ params }) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `api/v1/products/${params.category}/${params.brand}/${params.id}/`, { cache: 'no-store' })
    const data = await res.json();
    const productlist = data


    return <main><ProductTable products={productlist}/></main>
}

