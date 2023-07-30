import React from "react";
import { useGetBoardsQuery } from "../../../services/api/BoardApi";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Shimmer from "../../Shimmer/Shimmer";

const Boards = () => {
  const { data, isLoading, isFetching } = useGetBoardsQuery();
  return (
    <>
      {isLoading || isFetching ? (
        <div className="mt-12 w-[95%] flex  gap-2 flex-wrap">
          {[1, 2, 3, 4].map((e, i) => (
            <Shimmer key={i} />
          ))}
        </div>
      ) : (
        <div className="boards flex gap-3 flex-wrap md:justify-center justify-normal">
          {data?.map((board) => (
            <Link
              className="group relative block md:min-w-[23%]  min-w-full md:max-w-[23%]  bg-[#F9F9FB] dark:bg-[#1E283A] p-[20px] rounded-lg mt-5 "
              to={`${board.boardNumber}`}
              key={board.boardNumber}
            >
              <p className="group-hover:text-[#317FB6] text-[1.2rem]">
                {board.name}
              </p>
              <p className="text-[#7a7070] dark:text-[#95A2B8] text-[0.9rem] pb-3">
                Description: {board.description}
              </p>
              <p className="absolute bottom-1 right-2 text-sm text-[#317FB6]">
                {formatDistanceToNow(new Date(board?.createdAt))} ago..
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Boards;
