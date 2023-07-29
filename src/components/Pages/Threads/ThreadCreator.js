import React, { useState } from "react";
import ImageCompress from "quill-image-compress";

import ReactQuill, { Quill } from "react-quill";
import { Field, Formik } from "formik";
import sanitizeHtml from "sanitize-html";
import "react-quill/dist/quill.snow.css";
import { usePostThreadMutation } from "../../../services/api/ThreadApi";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentBoard } from "../../../features/Boards/BoardSlice";
import { boardApi } from "../../../services/api/BoardApi";
import { useEffect } from "react";
const ThreadCreator = ({ closeModal }) => {
  const dispatch = useDispatch();
  Quill.register("modules/imageCompress", ImageCompress);

  const board = useSelector(getCurrentBoard);
  const boardName = board?.name;

  const [postThread, { isError, isLoading, isSuccess }] =
    usePostThreadMutation();

  const [trigger] = boardApi.endpoints.getBoard.useLazyQuery();

  useEffect(() => {
    if (isSuccess && !isLoading && !isError) {
      trigger(board?.boardNumber);
    }
  }, [isSuccess, isLoading, dispatch, board?.boardNumber, isError, trigger]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
    ],
    imageCompress: {
      quality: 0.7, // default
      maxWidth: 1000, // default
      maxHeight: 1000, // default
      imageType: "image/jpeg", // default
      debug: true, // default
      suppressErrorLogging: false, // default
      insertIntoEditor: undefined, // default
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const formHandler = async (values, { setSubmitting, resetForm }) => {
    const payload = {
      user: values.user,
      subject: values.subject,
      content: values.content,
      boardName: boardName,
      tags: values.tags.split(","),
    };
    try {
      resetForm();
      await postThread(payload);
      setSubmitting(false);
      closeModal();
    } catch (error) {
      console.log("An error occured during creating thread: ", error);
    }
  };

  return (
    <>
      <div className="border-2 shadow-2xl overflow-y-auto fixed w-[90%] bg-white  h-[90vh] rounded-xl top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
        <button
          onClick={closeModal}
          className="text-white relative flex justify-center float-right text-[2rem] w-6 h-6 bg-[#317FB6] rounded-full mt-2 mr-2"
        >
          <div className="w-1  h-full bg-white rotate-45 absolute"></div>
          <div className="w-1  h-full bg-white absolute -rotate-45"></div>
        </button>
        <Formik
          initialValues={{
            subject: "",
            content: "",
            user: "",
            tags: "",
          }}
          onSubmit={formHandler}
        >
          {({
            handleSubmit,
            values,
            handleBlur,
            handleChange,
            errors,
            touched,
          }) => (
            <>
              <form onSubmit={handleSubmit}>
                <div>
                  <div className="mt-10 py-5 px-10">
                    <div className="title mb-5 ">
                      <p className="font-semibold  text-[1rem] text-[#317FB6]">
                        Subject
                      </p>
                      <p className="text-[0.8rem] text-gray-600 mt-1">
                        Enter the subject, this will be shown as heading of your
                        thread
                      </p>
                      <input
                        required
                        id="subject"
                        name="subject"
                        disabled={isLoading}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.subject}
                        type="text"
                        className="border-gray-400 border-[1px] w-[100%] rounded-md focus:border-[#317FB6] outline-none text-[1rem] py-[5px] px-2"
                      />
                    </div>
                    <div className="title mb-5 ">
                      <p className="font-semibold  text-[1rem] text-[#317FB6]">
                        Username
                      </p>
                      <p className="text-[0.8rem] text-gray-600 mt-1">
                        Enter the dummy username (optional)
                      </p>
                      <input
                        id="user"
                        name="user"
                        value={values.user}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        className="border-gray-400 border-[1px] w-[100%] rounded-md focus:border-[#317FB6] outline-none text-[1rem] py-[5px] px-2"
                      />
                    </div>
                    <div className="title mb-5 ">
                      <p className="font-semibold  text-[1rem] text-[#317FB6]">
                        Tags
                      </p>
                      <p className="text-[0.8rem] text-gray-600 mt-1">
                        Enter comma separated tags
                      </p>
                      <input
                        name="tags"
                        id="tags"
                        value={values.tags}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        className="border-gray-400 border-[1px] w-[100%] rounded-md focus:border-[#317FB6] outline-none text-[1rem] py-[5px] px-2"
                      />
                    </div>
                    <div className="mb-4">
                      <p className="font-semibold  text-[1rem] text-[#317FB6]">
                        Content
                      </p>
                      <p className="text-[0.8rem] text-gray-600 mt-1">
                        Include all the content you wanna share
                      </p>
                      <div>
                        <Field
                          name="content"
                          validate={(value) => {
                            let cleanHtml = sanitizeHtml(values.content);
                            const tempElement = document.createElement("div");
                            tempElement.innerHTML = cleanHtml;
                            let plainText =
                              tempElement.textContent || tempElement.innerText;
                            tempElement.remove();
                            let error;
                            if (plainText.length <= 0)
                              error = "Content cant be empy";
                            return error;
                          }}
                        >
                          {({ field }) => (
                            <ReactQuill
                              name={field.name}
                              id={field.name}
                              placeholder="Write the Thread content here..."
                              theme="snow"
                              value={field.value}
                              onChange={field.onChange(field.name)}
                              modules={modules}
                              formats={formats}
                            />
                          )}
                        </Field>

                        {errors.content && (
                          <p className="text-red-500 mt-1 text-sm">
                            {errors.content}
                          </p>
                        )}
                      </div>
                      <div className="mt-10">
                        <button
                          type="submit"
                          className="bg-[#317FB6] px-3 py-2 rounded-lg text-white"
                        >
                          Create
                        </button>
                        <p className="text-sm mt-2 text-red-400">
                          You will be posting anonymously, and post according to
                          the board.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ThreadCreator;
