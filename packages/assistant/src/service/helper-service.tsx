/**
 * Software Name : UUV
 *
 * SPDX-License-Identifier: MIT
 *
 * This software is distributed under the MIT License,
 * see the "LICENSE" file for more details
 *
 * Authors: NJAKO MOLOM Louis Fredice & SERVICAL Stanley
 * Software description: Make test writing fast, understandable by any human
 * understanding English or French.
 */

import { notification, type NotificationArgsProps } from "antd";
import { NotificationInstance } from "antd/lib/notification/interface";
import React from "react";
type NotificationPlacement = NotificationArgsProps["placement"];

export class HelperService {
    private readonly api: NotificationInstance;
    readonly contextHolder: React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;

    constructor(container: HTMLElement | ShadowRoot) {
        const [api, contextHolder] = notification.useNotification({
            getContainer: () => container,
        });
        this.api = api;
        this.contextHolder = contextHolder;
    }

    openNotification(placement: NotificationPlacement, title: string, message?: string, duration = 0) {
        const Context = React.createContext({ name: "default" });
        this.api.error({
            message: title,
            description: <Context.Consumer>{() => message}</Context.Consumer>,
            placement,
            duration,
        });
    }
}
