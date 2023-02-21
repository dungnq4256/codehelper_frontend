import React from "react";
import PropTypes from "prop-types";
import avatar from "../../../assets/images/avatar.png";
import "./style.scss";

Argument.propTypes = {};

function Argument(props) {
    return (
        <div>
            <div className="comment p-5 container-sm bg-body shadow-sm rounded">
                <div className="d-flex">
                    <div className="flex-shrink-0">
                        <img className="header-avatar" src={avatar} alt="" />
                    </div>
                    <div className="flex-grow-1 mx-2">
                        <p className="fw-bold fs-5 my-0">@Golanginya</p>
                        <p className="fw-normal fs-6">12 November 2020 19:35</p>
                    </div>
                    <div className="flex-grow-0">{/* icon more */}</div>
                </div>
                <div className="content">
                    <p className="fw-bold fs-2">How to patch KDE on FreeBSD?</p>
                    <p className="fw-lighter fs-5">Something went wrong</p>
                    <code className="my-3 fs-6">
                                    {`
                            #include<stdio.h>
                            int main() {
                                printf("Hello World");
                            }
                        `}
                    </code>
                    <p className="fw-lighter fs-5">I need your help</p>
                </div>
                <div className="d-flex">
                    <div className="flex-shrink-0">
                        <span className="badge rounded-pill bg-light text-secondary">
                            C
                        </span>
                    </div>
                    <div className="flex-grow-1 ms-2">
                        <span className="badge rounded-pill bg-light text-secondary">
                            Beginners
                        </span>
                    </div>
                    <div className="flex-grow-0 button rounded-pill">
                        <button className="btn text-white" type="submit">
                            {" "}
                            Vote
                            {/* icon up Vote */}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Argument;
