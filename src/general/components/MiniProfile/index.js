import React from 'react';
import PropTypes from "prop-types";
import "./style.scss";
import AppResource from 'general/constants/AppResource';

MiniProfile.propTypes = {
    accountName : PropTypes.string,
    imgLink : PropTypes.string,
    numberFirst : PropTypes.string,
    numberSecond : PropTypes.string,
    githubLink : PropTypes.string,
    instagramLink : PropTypes.string,
    facebookLink : PropTypes.string,
};

MiniProfile.defaultProps = {
    accountName: "MiniProfile",
    imgLink: AppResource.images.imgDefaultAvatar,
    numberFirst: "125",
    numberSecond: "8",
    githubLink: "https://github.com",
    instagramLink: "https://www.instagram.com",
    facebookLink: "https://www.facebook.com"
};

function MiniProfile(props) {
    const { accountName, imgLink, numberFirst, numberSecond, githubLink, instagramLink, facebookLink } = props
    return (
        <div className="miniProfile position-fixed m-8 d-none d-lg-block p-6" style={{right: '0px'}}>
            <div className='d-flex align-items-center flex-column'>
                <div className='miniProfile_Avatar'><img src={imgLink} alt="MiniProfile" className="rounded-circle"/></div>
                <h2 className="miniprofile-account">{accountName}</h2>
                <div className="miniprofile-line"></div>
                <div className="miniprofile-rank d-flex flex-row align-items-center">
                    <a href="#"><i className="fas fa-medal"></i></a>
                    <p className='m-0'>{`${numberFirst} [${numberSecond}]`}</p>
                </div>
                <div className="miniprofile-line"></div>
                <div className="miniprofile-social">
                    <a href={githubLink}><i className="fab fa-github"></i></a>
                    <a href={instagramLink}><i className="fab fa-instagram mx-4"></i></a>
                    <a href={facebookLink}><i className="fab fa-facebook-f"></i></a>
                </div>
            </div>
        </div>
    )
}

export default MiniProfile;