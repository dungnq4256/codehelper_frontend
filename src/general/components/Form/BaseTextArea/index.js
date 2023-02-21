import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import autosize from 'autosize';
import { useTranslation } from 'react-i18next';
import './style.scss'

BaseTextArea.propTypes = {
    name: PropTypes.string.isRequired,
    fieldProps: PropTypes.object,
    fieldMeta: PropTypes.object,
    fieldHelpers: PropTypes.object,

    resizable: PropTypes.bool,
    rows: PropTypes.number,
    autoHeight: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    text: PropTypes.string,
    className: PropTypes.string,
};

BaseTextArea.defaultProps = {
    resizable: true,
    rows: 3,
    autoHeight: false,
    label: '',
    placeholder: '',
    disabled: false,
    text: '',

    fieldProps: {},
    fieldHelper: {},
    fieldMeta: {},

    className: 'form-group',
};

function BaseTextArea(props) {
    // MARK: --- Params ---
    const {
        fieldProps,
        fieldMeta,
        fieldHelpers,
        name,
        label,
        placeholder,
        disabled,
        text,
        rows,
        autoHeight,
        resizable,
        className
    } = props;
    const { error, touched } = fieldMeta;
    const showError = error && touched;
    const { t } = useTranslation();

    // MARK: --- Hooks ---
    useEffect(() => {
        if (autoHeight) {
            const element = document.getElementById(name);
            if (element) {
                autosize(element);
            }
        }
    }, []);

    return (
        <div className="BaseTextArea">
            <div className={className}>
                {
                    label && (<label className='text-remaining' htmlFor={name}>{label}</label>)
                }
                <textarea
                    id={name}
                    className={`form-control form-control-lg ${showError ? 'is-invalid' : ''} ${resizable ? '' : 'resize-none'}`}
                    rows={rows}
                    {...fieldProps}

                    disabled={disabled}
                    placeholder={placeholder}
                >
                </textarea>

                {
                    showError && (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block">{error}</div>
                        </div>
                    )
                }

                <span className="form-text text-muted">{text}</span>
            </div>
        </div>
    );
}

export default BaseTextArea;