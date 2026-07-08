import PriceForm from '../../components/PriceForm';

export default async function EditPricePage({ params }) {
    const resolvedParams = await params;
    return <PriceForm id={resolvedParams.id} />;
}
