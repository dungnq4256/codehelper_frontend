import React from 'react';
import PropTypes from 'prop-types';
import AppResource from 'general/constants/AppResource';

EmptyView.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    additionalClassName: PropTypes.string,
};

EmptyView.defaultProps = {
    title: '',
    description: '',
    additionalClassName: ''
}

function EmptyView(props) {
    const { title, description, additionalClassName } = props;
    return (
        <div className={`${additionalClassName}`}>
             <div className='d-flex flex-column align-items-center border-left border-right bg-light py-10'>
                <img
                    className=''
                    alt='icon'
                    draggable={false}
                    src={AppResource.images.imgNoData}
                />
            <div className='d-flex flex-column align-items-center my-5'>
                <h2 className='font-weight-boldest'>{title}</h2>
                <p className='text-center font-size-base'>{description}</p>
            </div>
        </div>
        </div>
    );
}

export default EmptyView;