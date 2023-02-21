import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import './style.scss';

DropdownSelect.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    text: PropTypes.string,

    options: PropTypes.array,
    onValueChanged: PropTypes.func,
    additionContainerSelectClass: PropTypes.string,

    actionItems: PropTypes.array,
    additionalLabelClassName: PropTypes.string,
};

DropdownSelect.defaultProps = {
    label: "",
    disabled: false,
    text: "",
    value: '',
    options: [],
    onValueChanged: null,
    additionContainerSelectClass: '',
    actionItems: [],
    additionalLabelClassName: ''
};

function DropdownSelect(props) {
    // MARK: --- Params ---
    const {
        name,
        value,
        label,
        disabled,
        text,
        options,
        onValueChanged,
        additionContainerSelectClass,
        actionItems,
        additionalLabelClassName
    } = props;
    const currentOption = options.find(item => item.value === value);

    // MARK: --- Functions ---
    function handleOptionChanged(item) {
        const selectedValue = item.value;

        if (onValueChanged) {
            onValueChanged(selectedValue);
        }
    }

    return (
        <div className='DropdownSelect d-flex align-items-center'>
            {label && (<label className={`mr-4 mb-0 ${additionalLabelClassName}`} style={{ whiteSpace: 'nowrap' }}>{label}</label>)}
            <div className={additionContainerSelectClass}>
                <Dropdown className='' align='end'>
                    <Dropdown.Toggle
                        disabled={disabled}
                        className='d-flex flex-row align-items-center custom-dropdown-select btn-outline-secondary'
                        variant=''>
                        <p className='mb-0'>{currentOption?.text}</p>
                        <i className="fas fa-caret-down ml-2 text-dark-50"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='w-100' style={{minWidth: '170px'}}>
                        <div className='max-h-225px overflow-auto'>
                            {
                                options.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <Dropdown.Item
                                                className='d-flex justify-content-between'
                                                href="#"
                                                onClick={() => {
                                                    if (item.onPress) {
                                                        item.onPress();
                                                    } else {
                                                        handleOptionChanged(item);
                                                    }
                                                }}>
                                                {item.text}
                                                {value === item.value && <i className="far fa-solid fa-check text-primary pl-3" style={{ flex: '0 0 auto' }} />}
                                            </Dropdown.Item>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className=''>
                            {
                                actionItems.map((item, index) => {
                                    return (
                                        <Dropdown.Item
                                            key={index}
                                            className='d-flex flex-row justify-content-start border-top btn-light align-items-center'
                                            onClick={() => {
                                                if (item.onPress) {
                                                    item.onPress();
                                                }
                                            }}>
                                            <i className="text-primary fal fa-plus"></i>
                                            <span className='text-primary ml-3 font-weight-bolder'>CreateMyList'</span>
                                        </Dropdown.Item>
                                    )
                                })
                            }
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
}

export default DropdownSelect;