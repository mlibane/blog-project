export default function BlogPost({ params }: { params: { slug: string } }) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Blog Post: {params.slug}</h1>
        {/* Blog post content will be added here */}
      </div>
    )
  }