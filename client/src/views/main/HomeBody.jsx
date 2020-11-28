import React, { useEffect, useState } from "react";
import Modal from "../../components/misc/Modal";
import Post from "../../components/posts/Post";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postSchema } from "../../models/PostSchema";
import Spinner from "react-spinners/MoonLoader";
import { PostService } from "../../services/PostService";
import CreatePost from "../../components/misc/CreatePost";
import SortTab from "../../components/misc/SortTab";
import { RiImageAddFill } from "react-icons/ri";

const Body = ({ currentUser }) => {
  const _post = new PostService();
  const [posts, setPosts] = useState([]);
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(postSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postUpdated, setPostUpdated] = useState(true);
  const [sortedBy, setSortedBy] = useState("LATEST");
  const [fileURL, setFileURL] = useState();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await _post.createPost(data);
      setPostUpdated(true);
      setShowModal(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const getAllPosts = async () => {
      setIsLoading(true);
      let posts = [];
      if (sortedBy === "POPULAR") posts = await _post.getAllPopularPosts();
      else posts = await _post.getAllPosts();
      setPosts(posts);
      console.log(posts);
      setIsLoading(false);
      setPostUpdated(false);
    };
    if (postUpdated || sortedBy) {
      getAllPosts();
    }
  }, [postUpdated, sortedBy]);

  return (
    <>
      <div className="w-3/5  px-4 pt-2">
        <CreatePost currentUser={currentUser} setShowModal={setShowModal} />
        <SortTab sortedBy={sortedBy} setSortedBy={setSortedBy} />

        <div className="bg-transparent rounded-lg mt-4 flex flex-col">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-screen ">
              <Spinner />
            </div>
          ) : (
            posts.map((post) => {
              return <Post key={post.id} post={post} />;
            })
          )}
        </div>
      </div>
      {/* Modal */}
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        contentLabel="AboutModal"
      >
        <div className="flex flex-col justify-center">
          <h1 className="font-bold text-2xl text-center">Ask for Help</h1>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <textarea
              className={`
            ${errors.description ? "border border-red-600" : null} 
            focus:outline-none h-64 focus:bg-gray-200  font-medium rounded-lg bg-gray-100 w-full px-6 py-4 text-sm mt-4`}
              type="text"
              placeholder="What's wrong?"
              name="description"
              rows="4"
              cols="50"
              ref={register}
            />
            {errors.description ? (
              <small className="text-xs w-2/5 text-red-600 font-medium my-1">
                {errors.description?.message}
              </small>
            ) : null}
            <select
              className={`
            ${errors.category ? "border border-red-600" : null} 
            focus:outline-none focus:bg-gray-200  font-medium rounded-lg bg-gray-100 w-full h-14 px-6 py-4 text-sm mt-4`}
              type=""
              placeholder="Category"
              name="category"
              ref={register}
            >
              <option value="TYPHOON">Typhoon</option>
              <option value="FIRE">Fire</option>
              <option value="EARTHQUAKE">Earthquake</option>
              <option value="CRIME">Crime</option>
            </select>
            {errors.category ? (
              <small className="text-xs w-2/5 text-red-600 font-medium my-1">
                {errors.category?.message}
              </small>
            ) : null}
            <div className="w-full flex  items-center justify-center">
              <label className="w-full bg-gray-100 mt-4 flex flex-col items-center justify-center px-4 py-6  text-blue rounded-lg tracking-wide uppercase  cursor-pointer hover:bg-gray-200 hover:text-white">
                {fileURL ? (
                  <img
                    className="w-64 h-36 object-cover rounded-lg"
                    src={fileURL}
                  />
                ) : (
                  <>
                    <RiImageAddFill size={30} />
                    <span className="mt-2 text-base leading-normal">
                      Add a photo
                    </span>
                  </>
                )}

                <input
                  ref={register}
                  type="file"
                  class="hidden"
                  name="photo"
                  onChange={(e) =>
                    setFileURL(URL.createObjectURL(e.target.files[0]))
                  }
                />
              </label>
            </div>

            {/* {errors.description ? (
              <small className="text-xs w-2/5 text-red-600 font-medium my-1">
                {errors.description?.message}
              </small>
            ) : null} */}

            <button
              className="transition duration-500 w-full flex justify-center ease-in-out focus:bg-red-600 bg-red-500 focus:outline-none hover:bg-red-600 mt-9 cursor-pointer text-white font-semibold tracking-widest px-16 py-3 rounded-lg text-sm"
              type="submit"
            >
              {isSubmitting ? (
                <Spinner color={"#fff"} size={15}></Spinner>
              ) : (
                "SUBMIT"
              )}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Body;
