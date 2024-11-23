"use client";

import { useEffect, useState } from "react";
import { GET_ALL_SITES, DELETE_SITE } from "../constants";
import Loader from "../components/Loader";
import { useNotification } from "../utils/useNotification";
import NoContentPage from "../components/NoContentPage";
import Link from "next/link";

interface SiteData {
    title: string;
    description: string;
    image: string;
    url: string;
    author: string;
    isTrending: boolean;
    updatedAt: string;
    _id: string;
}

const SitesTable = () => {
    const [sites, setSites] = useState<SiteData[]>();
    const [loading, setLoading] = useState(true);

    const { showAlert } = useNotification();

    async function fetchPosts() {
        try {
            let res = await fetch(GET_ALL_SITES);
            let data = await res.json();
            setSites(data.data);
        } catch (error: any) {
            console.error("Failed to get all sites", error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDeleteButton = async (siteId: string) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this site?");
        if (!userConfirmed) return;

        try {
          const res = await fetch(`${DELETE_SITE}/${siteId}`, {
            method: "DELETE",
          });

          if (!res.ok) {
            showAlert("error", "Failed to delete site!");
            return;
          }

          showAlert("success", "Site deleted successfully");
          await fetchPosts();
        } catch (error: any) {
          console.error("Error deleting site:", error.message);
          showAlert("error", "Something unexpected occurred!");
        }
      };


    if (!sites || loading) return <Loader />;
    if (sites.length === 0) return <NoContentPage />;

    return (
        <div className="w-full p-6">
            <div className="rounded-lg border border-slate-700 bg-slate-800">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-700 bg-slate-800">
                            <th className="px-4 py-3 text-left text-gray-200 font-medium">
                                Title
                            </th>
                            <th className="px-4 py-3 text-left text-gray-200 font-medium">
                                Description
                            </th>
                            <th className="px-4 py-3 text-left text-gray-200 font-medium">
                                Image
                            </th>
                            <th className="px-4 py-3 text-left text-gray-200 font-medium">
                                URL
                            </th>
                            <th className="px-4 py-3 text-left text-gray-200 font-medium">
                                Author
                            </th>
                            <th className="px-4 py-3 text-left text-gray-200 font-medium">
                                Trending
                            </th>
                            <th className="px-4 py-3 text-left text-gray-200 font-medium">
                                Date
                            </th>
                            <th className="px-4 py-3 text-left text-gray-200 font-medium">
                                Actions
                            </th>
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
                                        src={site.image}
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
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${site.isTrending
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-red-500/20 text-red-400"
                                            }`}
                                    >
                                        {site.isTrending ? "True" : "False"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-200">
                                    {new Date(site.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex space-x-2">
                                        <Link
                                            href={{
                                                pathname: '/site',
                                                query: {
                                                    id: site._id
                                                }
                                            }}
                                            className="px-3 py-1 text-xs rounded-md bg-slate-600 text-gray-200 hover:bg-slate-500">
                                            Edit
                                        </Link>
                                        <button className="px-3 py-1 text-xs rounded-md bg-red-600 text-gray-200 hover:bg-red-500" onClick={() => handleDeleteButton(site._id)}>
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
