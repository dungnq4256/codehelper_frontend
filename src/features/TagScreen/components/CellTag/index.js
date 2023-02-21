import React from "react";
import PropTypes from "prop-types";

CellTag.propTypes = {
    name: PropTypes.string,
    clickTag: PropTypes.func,
    isMyTag: PropTypes.element,
    description: PropTypes.string,
    numberOfQuestion: PropTypes.number,
    questionPerWeek: PropTypes.number,
    questionThisDay: PropTypes.number,
};

CellTag.defaultProps = {
    name: "",
    clickTag: null,
    isMyTag: null,
    description: "",
    numberOfQuestion: 0,
    questionPerWeek: 0,
    questionThisDay: 0,
};

function CellTag(props) {
    const {
        name,
        clickTag,
        isMyTag,
        description,
        numberOfQuestion,
        questionPerWeek,
        questionThisDay,
    } = props;
    return (
        <div className="CellTag bg-white border rounded custom-cell p-5 h-100 d-flex flex-column justify-content-between"
            
        >
            <div>
                <div className="d-flex align-items-center justify-content-between">
                    <p className="badge bg-secondary text-remaining"
                        onClick={clickTag}
                    >
                        {name}
                    </p>
                    {isMyTag}
                </div>
                <p className="q-max-line-4">{description}</p>
            </div>
            <div className='d-flex justify-content-between flex-wrap'>
                <span className='text-muted'>{`${numberOfQuestion} câu hỏi`}</span>
                {/* <span className='text-muted'>{`${numberOfQuestion} câu hỏi trong tuần`}</span> */}
            </div>
        </div>
    );
}

export default CellTag;
