import React from 'react';
import PropTypes from 'prop-types';
import AppResource from 'general/constants/AppResource';
import './style.scss';

AuthContent.propTypes = {
    leftElement: PropTypes.element,
    leftTitle: PropTypes.string,
    leftDescription: PropTypes.string,
    authImage: PropTypes.string,
};

AuthContent.defaultProps = {
    leftElement: (<div></div>),
    leftTitle: 'CodeHelper',
    leftDescription: 'Hơn 15000 câu hỏi đang chờ đợi sự trợ giúp của bạn',
    authImage: AppResource.images.imgSignIn
}

function AuthContent(props) {

    const { leftElement, leftTitle, leftDescription, authImage } = props;

    return (
        <div className='AuthContent d-flex align-items-center justify-content-center'>
            <div className='w-lg-100 w-md-50 w-100 mx-10 mx-md-0'>
                <div className='d-flex'>
                    {/* left */}
                    <div className='AuthContent_Form d-flex flex-column justify-content-center align-items-center w-lg-50 p-10 w-100 px-lg-40 border-top bg-white mt-40 mt-lg-0 rounded rounded-lg-0'>
                        <div  className='w-sm-375px'>
                            <p className='AuthContent_Title text-center text-lg-left text-dark-75'>{leftTitle}</p>
                            <p className='AuthContent_Description text-center text-lg-left text-dark-75'>{leftDescription}</p>
                            <div>
                                {leftElement}
                            </div>
                        </div>
                    </div>

                    {/* right */}
                    <div className='AuthContent_Image bg-warning w-50'>
                        <img src={authImage} alt="authentication" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthContent;