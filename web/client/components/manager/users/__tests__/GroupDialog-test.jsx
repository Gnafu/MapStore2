/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require("react");
const expect = require('expect');
const ReactDOM = require('react-dom');
const GroupDialog = require('../GroupDialog');
const ReactTestUtils = require('react-dom/test-utils');
const user1 = {
    id: 100,
    name: "USER2",
    role: "USER",
    enabled: false,
    groups: [{
        id: 1,
        groupName: "GROUP1"
    }]
};
const user2 = {
    id: 101,
    name: "ADMIN",
    role: "ADMIN",
    enabled: true,
    groups: [{
        id: 1,
        groupName: "GROUP1"
    }]
};
const group1 = {
    id: 1,
    groupName: "GROUP1",
    description: "description",
    enabled: true,
    users: [user1, user2]
};
const users = [ user1, user2 ];
describe("Test GroupDialog Component", () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('Test group rendering', () => {
        let comp = ReactDOM.render(
            <GroupDialog group={group1}/>, document.getElementById("container"));
        expect(comp).toExist();
    });

    it('Test group loading', () => {
        let comp = ReactDOM.render(
            <GroupDialog show group={{...group1, status: "loading"}}/>, document.getElementById("container"));
        expect(comp).toExist();
    });
    it('Test group error', () => {
        let comp = ReactDOM.render(
            <GroupDialog show group={{...group1, lastError: {statusText: "ERROR"}}}/>, document.getElementById("container"));
        expect(comp).toExist();
    });
    it('Test group dialog with users', () => {
        let comp = ReactDOM.render(
            <GroupDialog show group={group1} availableUsers={users}/>, document.getElementById("container"));
        expect(comp).toExist();
    });
    it('Test group dialog with new users', () => {
        let comp = ReactDOM.render(
            <GroupDialog show group={{...group1, newUsers: [user1]}} availableUsers={users}/>, document.getElementById("container"));
        expect(comp).toExist();
    });
    it('Testing selected group-dialog-tab is highlighted', () => {
        let comp = ReactDOM.render(
            <GroupDialog group={group1} />,
            document.getElementById("container"));

        expect(comp).toExist();
        const tabs = document.querySelectorAll('.nav.nav-justified > li');
        expect(tabs[0].getAttribute('class')).toBe('active');
        const groupGroupButton = tabs[1].children[0];
        ReactTestUtils.Simulate.click(groupGroupButton);
        expect(tabs[1].getAttribute('class')).toBe('active');
    });

    it('Testing asterisk inside mandatory field', () => {
        let comp = ReactDOM.render(
            <GroupDialog group={group1} />,
            document.getElementById("container"));

        expect(comp).toExist();
        const labels = document.querySelectorAll('.control-label');
        const [ groupName, description ] = labels;
        expect(groupName.children.length).toBe(2);
        expect(groupName.children[0].innerHTML).toBe('usergroups.groupName');
        expect(groupName.children[1].innerHTML).toBe('*');

        expect(description.children.length).toBe(1);
        expect(description.children[0].innerHTML).toBe('usergroups.groupDescription');
    });
});
