/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { ControlLabel, Form, FormControl, FormGroup } from 'react-bootstrap';
import { compose, getContext, withState } from 'recompose';

import LocaleUtils from '../../../utils/LocaleUtils';
import Message from '../../I18N/Message';
import BorderLayout from '../../layout/BorderLayout';
import Toolbar from '../../misc/toolbar/Toolbar';

const form = [
    {
        placeholder: "mediaEditor.mediaPicker.sourcePlaceholder",
        type: "text",
        id: "src",
        label: <Message msgId = "mediaEditor.mediaPicker.source"/>,
        validation: ({ src }) => src !== undefined && src === "" ?
            "error"
            : src
                ? "success"
                : undefined
    },
    {
        placeholder: "mediaEditor.mediaPicker.titlePlaceholder",
        type: "text",
        id: "title",
        label: <Message msgId = "mediaEditor.mediaPicker.title"/>,
        validation: ({ title }) => title !== undefined && title === "" ?
            "error"
            : title
                ? "success"
                : undefined
    },
    {
        placeholder: "mediaEditor.mediaPicker.altTextPlaceholder",
        type: "text",
        id: "alt",
        label: <Message msgId = "mediaEditor.mediaPicker.altText"/>
    },
    {
        placeholder: "mediaEditor.mediaPicker.descriptionPlaceholder",
        type: "text",
        id: "description",
        label: <Message msgId = "mediaEditor.mediaPicker.description"/>
    },
    {
        placeholder: "mediaEditor.mediaPicker.creditsPlaceholder",
        type: "text",
        id: "credits",
        label: <Message msgId = "mediaEditor.mediaPicker.credits"/>
    }
];

const enhance = compose(
    withState("properties", "setProperties", ({selectedItem = {}, editing}) => ( editing ? {...selectedItem.data} : {})),
    getContext({messages: {}})
);


export default enhance(({
    properties = {},
    setAddingMedia = () => {},
    setEditingMedia = () => {},
    setProperties = () => {},
    onSave = () => {},
    messages,
    editing
}) => (
    <BorderLayout
        className="ms-imageForm"
        header={
            <div
                className="text-center"
                key="toolbar"
                style={{
                    borderBottom: "1px solid #ddd",
                    padding: 8
                }}>
                    <Toolbar
                        btnGroupProps={{
                            style: {
                                marginBottom: 8
                            }
                        }}
                        btnDefaultProps={{
                            bsStyle: "primary",
                            className: "square-button-md"
                        }}
                        buttons={[{
                            glyph: "arrow-left",
                            tooltipId: "mediaEditor.mediaPicker.back",
                            onClick: () => editing ? setEditingMedia(false) : setAddingMedia(false)
                        }, {
                            glyph: "floppy-disk",
                            tooltipId: "mediaEditor.mediaPicker.save",
                            disabled: !properties.src || !properties.title,
                            onClick: () => {
                                onSave(properties);
                            }
                        }]} />
            </div>
        }>
        <Form style={{ padding: 8 }}>
            {form.map((field) => (
                <FormGroup
                    key={field.id}
                    validationState={field.validation && field.validation(properties)}>
                    <ControlLabel>
                        {field.label}
                    </ControlLabel>
                    <FormControl
                        type={field.type}
                        placeholder={LocaleUtils.getMessageById(messages, field.placeholder)}
                        value={properties[field.id] || ""}
                        onChange={(event) => {
                            setProperties({
                                ...properties,
                                [field.id]: event.target.value
                            });
                        }} />
                </FormGroup>
            ))}
        </Form>
    </BorderLayout>
));
