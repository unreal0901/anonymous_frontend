import React from "react";
import Comment from "./Comment";
import Reply from "./Reply";
import Shimmer from "../../Shimmer/Shimmer";
import { useGetThreadRepliesQuery } from "../../../services/api/ReplyApi";
import { useSelector } from "react-redux";
import { getCurrentThread } from "../../../features/Threads/ThreadSlice";

const Replies = ({ tid }) => {
  const {
    data: replies,
    isLoading,
    isFetching,
  } = useGetThreadRepliesQuery(tid);

  const threadData = useSelector(getCurrentThread);

  return (
    <>
      <div className="mt-8 px-4 py-2 bg-[#fafafa]">
        <div className="add_comment flex gap-5 items-center text-[1rem] mt-2">
          <div>
            <p>{threadData?.replyCount || 0} Replies</p>
          </div>
          <div className="flex items-center gap-2 ">
            <i className="bx bx-sort-down"></i>
            <span>Sort by</span>
          </div>
        </div>
        <Comment />
        <div className="replies mt-7 bg-[#c4c4c4] p-2 rounded-lg">
          {isLoading || isFetching ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4].map((e, i) => {
                return <Shimmer key={i} h="5rem" w="100%" />;
              })}
            </div>
          ) : (
            replies.map((reply) => {
              return <Reply key={reply.replyNumber} reply={reply} />;
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Replies;
