import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CommentAllComment.css";
import { PiUserMinusDuotone } from "react-icons/pi";
import { PiUserPlusDuotone } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import axios from "axios";
import moment from "moment";
import MyContext from "../Context/MyContext";

const AllComment = (props) => {
  const { comment, sendTypeComment, clickEditDelete } = props;
  const { readData, fillData } = useContext(MyContext);

  const [allComment, setAllComment] = useState();
  const [readMore, setReadMore] = useState();
  const [openEditComment, setOpenEditComment] = useState();
  const [textCommentEdit, setTextCommentEdit] = useState("");
  const [typeComment, setTypeComment] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    if (comment) {
      setAllComment(JSON.parse(comment.commentData));
    }
  }, [comment]);

  useEffect(() => {
    if (allComment) {
      setReadMore(fillData(allComment, false));
      setOpenEditComment(fillData(allComment, false));
    }
  }, [allComment]);

  useEffect(() => {
    sendTypeComment(typeComment);
  }, [typeComment]);

  const editComment = async (idComment, indexCommentShow, createData) => {
    try {
      const login = await readData(true);
      if (!login[0]) return navigate(login[1]);
      let data = [...openEditComment];
      const username = login[1].username;

      const response = await axios.put(
        `${process.env.REACT_APP_API}comment/edit`,
        {
          username,
          textCommentEdit,
          idComment,
          createData,
        }
      );
      setAllComment(JSON.parse(response.data));

      clickEditDelete();
      data[indexCommentShow] = false;
      setOpenEditComment(data);
    } catch {}
  };

  const deleteComment = async (idComment, indexCommentShow, createData) => {
    try {
      const login = await readData(true);
      if (!login[0]) return navigate(login[1]);

      let data = [...openEditComment];
      const username = login[1].username;

      const response = await axios.delete(
        `${process.env.REACT_APP_API}comment/delete`,
        {
          data: {
            username,
            idComment,
            createData,
          },
        }
      );
      setAllComment(JSON.parse(response.data));

      clickEditDelete();
      data.splice(indexCommentShow, 1);
      setOpenEditComment(data);
    } catch {}
  };

  return (
    <div className="d-flex w-100 flex-column mt-5 rounded position-relative">
      <select
        className="form-select mb-3 text-center fs-5"
        onChange={(event) => setTypeComment(event.target.value)}
      >
        <option value="All">All</option>
        <option value="Positive">Positive</option>
        <option value="Negative">Negative</option>
      </select>
      {allComment &&
        allComment.map((dataComment, indexComment) => (
          <div
            key={indexComment}
            className={`w-100 comment-box 
            ${indexComment === allComment.length - 1 ? "mb-5" : ""}
            `}
          >
            <div className="h-20 w-100 d-flex justify-content-between bg-red-comment rounded">
              <div className="h-100 d-flex">
                <h3 className="fs-4 mr-1 ml-1 ">{dataComment.username}</h3>
                <h4 className="d-flex align-items-center h-100">
                  {dataComment.sentiment === "positive" ? (
                    <PiUserPlusDuotone className="fs-3 cursor-pointer bg-red rounded-circle " />
                  ) : (
                    <PiUserMinusDuotone className="fs-3 cursor-pointer bg-success rounded-circle" />
                  )}
                </h4>
              </div>
              <div className="h-100 mr-1 d-flex">
                {
                  <h4 className="d-flex align-items-center fs-6 mr-1">
                    {dataComment.edited && "previously edited"}
                  </h4>
                }
                <h4 className="d-flex align-items-center fs-6 mr-1">
                  {moment(
                    new Date(
                      Date.parse(dataComment.created) + 60 * 60 * 1000 * 7
                    )
                  ).format("YYYY-MM-DD")}
                </h4>
                {openEditComment &&
                  dataComment.edit &&
                  !openEditComment[indexComment] && (
                    <div className="h-100 d-flex align-items-center">
                      <CiEdit
                        className="fs-4 mr-1 cursor-pointer"
                        onClick={() => {
                          let data = [...openEditComment];
                          data[indexComment] = true;
                          setOpenEditComment(data);
                        }}
                      />
                      <MdDelete
                        className="fs-4 cursor-pointer"
                        onClick={() =>
                          deleteComment(
                            dataComment.idComment,
                            indexComment,
                            dataComment.created
                          )
                        }
                      />
                    </div>
                  )}

                {openEditComment && openEditComment[indexComment] && (
                  <div className="d-flex align-items-center ">
                    <IoArrowBackOutline
                      className="fs-4 cursor-pointer"
                      onClick={() => {
                        let data = [...openEditComment];
                        data[indexComment] = false;
                        setOpenEditComment(data);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div
              className={`h-80 w-100 
              ${
                openEditComment && !openEditComment[indexComment]
                  ? "d-flex align-items-center pl-1 overflow-auto justify-content-between"
                  : "bg-light rounded"
              }`}
            >
              {openEditComment && !openEditComment[indexComment] ? (
                <>
                  {readMore && !readMore[indexComment] ? (
                    dataComment.comment.length < 40 ? (
                      <h4 className="fs-5">{dataComment.comment}</h4>
                    ) : (
                      <div className="d-flex align-items-center  ">
                        <h4 className="fs-5 mr-1">
                          {dataComment.comment.substring(0, 40)}...
                        </h4>
                        <h4
                          onClick={() => {
                            let data = [...readMore];
                            data[indexComment] = true;
                            setReadMore(data);
                          }}
                          className="fs-5 text-muted filter-brightness cursor-pointer"
                        >
                          Read more
                        </h4>
                      </div>
                    )
                  ) : (
                    <div className="d-flex align-items-center">
                      <h4 className="fs-5">{dataComment.comment}</h4>
                    </div>
                  )}

                  <h3 className="fs-6 mr-1 ml-1 d-flex align-items-center">
                    {new Date(
                      Date.parse(dataComment.created) + 60 * 60 * 1000 * 7
                    ).toLocaleTimeString("th-TH", { timeZone: "Asia/Bangkok" })}
                  </h3>
                </>
              ) : (
                <div className="w-100 h-100 mb-3 d-flex justify-content-between align-items-center">
                  <input
                    type="text"
                    className="form-control h-80 w-100 fs-5 border-0 focus-outline-none ml-1"
                    id="editData"
                    placeholder="You can express your thoughts here"
                    maxLength={60}
                    onChange={(event) => setTextCommentEdit(event.target.value)}
                  />
                  <button
                    className="ml-1 mr-1 btn btn-warning"
                    onClick={() =>
                      editComment(
                        dataComment.idComment,
                        indexComment,
                        dataComment.created
                      )
                    }
                  >
                    <h5 className="fs-6 text-white text-center text-shadow text-white">
                      edit
                    </h5>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AllComment;
