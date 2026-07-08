import BlogForm from '../../components/BlogForm';

export default async function EditBlogPage({ params }) {
    const resolvedParams = await params;
    return <BlogForm id={resolvedParams.id} />;
}
