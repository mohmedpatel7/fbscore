import React, { useEffect, useState } from "react";
import { fetchSearchResults } from "../../Redux/fetures/postslice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style/style.css";

export default function SearchData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchResult } = useSelector((state) => state.postSlice);

  return <div></div>;
}
