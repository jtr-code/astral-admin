"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { CREATE_SITE, GET_SITE_BY_ID, UPDATE_SITE } from "../constants";
import { useNotification } from "../utils/useNotification";
import React from "react";
import Loader from "../components/Loader";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    image: z.union([
        z.instanceof(FileList).transform(files => files.item(0) as File),
        z.instanceof(File),
        z.string().min(1, "Image is required")
    ]),
    url: z.string().optional(),
    author: z.string().optional(),
    isTrending: z.boolean().optional().default(false),
})

type FormValues = z.infer<typeof formSchema>;
type Params = { id?: string };

const Site = (context: any) => {
    const params: Params = React.use(context?.searchParams);
    const { id } = params;
    const router = useRouter()

    const [loading, setLoading] = React.useState(true);
    const [isEditMode] = React.useState(!!id);
    const [formValue, setFormValue] = React.useState({
        title: "",
        description: "",
        image: "",
        url: "",
        author: "",
        isTrending: false,
    });
    const [selectedFileName, setSelectedFileName] = React.useState(formValue?.image || '');

    const { showAlert } = useNotification();

    const defaultValues = {
        title: "",
        description: "",
        image: "",
        url: "",
        author: "",
        isTrending: false,
    };


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        reset,
        setValue,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues
    });


    const handleImageChange = (e: any) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setValue('image', file, { shouldValidate: true });
            setFormValue(prev => ({ ...prev, image: file.name }));
            setSelectedFileName(file.name);
        }
    };


    const resetAllForms = () => {
        reset(defaultValues);
        setFormValue(defaultValues);
        setSelectedFileName("");
    };


    const onSubmit: SubmitHandler<FormValues> = async (value) => {
        try {
            const { image } = value;
            const imageValue = image instanceof FileList ? image[0].name : formValue?.image;
            let response;

            if (id) {
                response = await fetch(`${UPDATE_SITE}/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...value, image: imageValue }),
                });
            } else {
                response = await fetch(CREATE_SITE, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...value, image: imageValue }),
                });
            }

            const data = await response.json();

            if (data.success) {
                resetAllForms();
                showAlert("success", id ? "Site updated successfully!" : "Site created successfully!");

                setTimeout(() => {
                    router.push('/listSite');
                }, 1500)
            } else {
                showAlert("error", id ? "Failed to update site!" : "Failed to create site!");
            }

            if (!response.ok) {
                console.error('Request failed with status:', response.status);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showAlert("error", "An unexpected error occurred!");
        }
    };


    React.useEffect(() => {
        if (id) {
            async function fetchSingleId() {
                try {
                    const res = await fetch(`${GET_SITE_BY_ID}/${id}`);
                    const data = await res.json();
                    setFormValue(data?.data);

                    Object.keys(data?.data).forEach(key => {
                        setValue(key as keyof FormValues, data?.data[key], {
                            shouldValidate: true,
                            shouldDirty: true
                        });
                    });
                } catch (error: any) {
                    console.error("Failed to fetch data based on id", error.message);
                } finally {
                    setLoading(false);
                }
            }
            fetchSingleId();
        } else {
            setLoading(false);
        }
    }, [id, setValue]);


    if (loading) return <Loader />;

    return (
        <form
            className="px-8 pt-6 pb-8 mb-4 space-y-6 min-h-screen"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="space-y-2">
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-200"
                >
                    Title*
                </label>
                <input
                    value={formValue?.title ?? ""}
                    {...register('title', {
                        onChange: (e) => {
                            setFormValue({
                                ...formValue,
                                title: e.target.value
                            })
                        },
                    })}
                    placeholder="Title of your site"
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-gray-200"
                />
                {errors.title && (
                    <span className="text-red-500">{errors.title.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-200"
                >
                    Description*
                </label>
                <textarea
                    value={formValue?.description ?? ""}
                    placeholder="Description of your site"
                    {...register("description", {
                        onChange: (e) => {
                            setFormValue({
                                ...formValue,
                                description: e.target.value
                            })
                        },
                    })}
                    rows={5}
                    className="w-full px-3 resize-none py-2 bg-slate-600 border border-slate-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-gray-200"
                />
                {errors.description && (
                    <span className="text-red-500">{errors.description.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="img" className="block text-sm font-medium text-gray-200">
                    Select image:*
                </label>
                <input
                    type="file"
                    {...register("image", {
                        required: !isEditMode || !formValue.image ? 'Image is required' : false,
                        onChange: handleImageChange
                    })}
                    id="img"
                    accept="image/*"
                    className="w-fit text-sm outline-none text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-600 file:text-gray-100 hover:file:bg-slate-700"
                />

                {selectedFileName && (
                    <span className="text-sm text-gray-200">Image : {selectedFileName}</span>
                )}

                {formValue.image && (
                    <span className="text-sm text-gray-200">Current Image : {formValue.image}</span>
                )}

                {errors.image && (
                    <span className="text-red-500">{(errors.image as any)?.message}</span>
                )}
            </div>


            <div className="space-y-2">
                <label htmlFor="url" className="block text-sm font-medium text-gray-200">
                    Url
                </label>
                <input
                    value={formValue?.url ?? ""}
                    {...register("url", {
                        onChange: (e) => {
                            setFormValue({
                                ...formValue,
                                url: e.target.value
                            })
                        },
                    })}
                    placeholder="Link of your site"
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-gray-200"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-200"
                >
                    Author
                </label>
                <input
                    value={formValue?.author ?? ""}
                    {...register("author", {
                        onChange: (e) => {
                            setFormValue({
                                ...formValue,
                                author: e.target.value
                            })
                        },
                    })}
                    placeholder="Author name"
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 text-gray-200"
                />
            </div>

            <div className="flex items-center space-x-3">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        {...register("isTrending", {
                            onChange: (e) => {
                                setFormValue({
                                    ...formValue,
                                    isTrending: e.target.value
                                })
                            },
                        })}
                        type="checkbox"
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-700"></div>
                </label>
                <span className="text-sm font-medium text-gray-200">isTrending</span>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className={`w-fit font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-700
          ${isSubmitting || !isValid
                            ? "bg-slate-400 text-gray-300 cursor-not-allowed"
                            : "bg-slate-600 hover:bg-slate-700 text-white"
                        }`}
                >
                    {isSubmitting ? "Publishing..." : isEditMode ? "Update" : "Publish"}
                </button>
            </div>
        </form>
    );
};

export default Site;