import React from 'react';

interface SiteData {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  author: string;
  isTrending: boolean;
  createdAt: string;
}

const SitesTable = () => {

  const sites: SiteData[] = [
    {
      title: "Example Site 1",
      description: "This is a description for site 1",
      imageUrl: "/placeholder1.jpg",
      url: "https://example1.com",
      author: "John Doe",
      isTrending: true,
      createdAt: "2024-10-30"
    },
    {
      title: "Example Site 2",
      description: "This is a description for site 2",
      imageUrl: "/placeholder2.jpg",
      url: "https://example2.com",
      author: "Jane Smith",
      isTrending: false,
      createdAt: "2024-10-29"
    }
  ];

  return (
    <div className="w-full p-6">
      <div className="rounded-lg border border-slate-700 bg-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800">
              <th className="px-4 py-3 text-left text-gray-200 font-medium">Title</th>
              <th className="px-4 py-3 text-left text-gray-200 font-medium">Description</th>
              <th className="px-4 py-3 text-left text-gray-200 font-medium">Image</th>
              <th className="px-4 py-3 text-left text-gray-200 font-medium">URL</th>
              <th className="px-4 py-3 text-left text-gray-200 font-medium">Author</th>
              <th className="px-4 py-3 text-left text-gray-200 font-medium">Trending</th>
              <th className="px-4 py-3 text-left text-gray-200 font-medium">Date</th>
              <th className="px-4 py-3 text-left text-gray-200 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sites.map((site, index) => (
              <tr key={index} className="hover:bg-slate-700">
                <td className="px-4 py-3 text-gray-200">{site.title}</td>
                <td className="px-4 py-3 text-gray-200">
                  {site.description.length > 50
                    ? `${site.description.substring(0, 50)}...`
                    : site.description}
                </td>
                <td className="px-4 py-3">
                  <img
                    src="/api/placeholder/50/50"
                    alt={site.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                </td>
                <td className="px-4 py-3">
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Visit Site
                  </a>
                </td>
                <td className="px-4 py-3 text-gray-200">{site.author}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${site.isTrending
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                    }`}>
                    {site.isTrending ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-200">
                  {new Date(site.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs rounded-md bg-slate-600 text-gray-200 hover:bg-slate-500">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-xs rounded-md bg-red-600 text-gray-200 hover:bg-red-500">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SitesTable;