// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import cl from 'classnames';
import { useState } from 'react';

import DisconnectApp from './DisconnectApp';
import ExternalLink from '_components/external-link';
import { useMiddleEllipsis } from '_hooks';
import { trackEvent } from '_src/shared/plausible';

import st from './SuiApp.module.scss';

export type DAppEntry = {
    name: string;
    description: string;
    link: string;
    icon: string;
    tags: string[];
};
export type DisplayType = 'full' | 'card';
export interface SuiAppProps extends DAppEntry {
    displayType: DisplayType;
    permissionID?: string;
}

const TRUNCATE_MAX_LENGTH = 18;

export function SuiApp({
    name,
    description,
    link,
    icon,
    tags,
    displayType,
    permissionID,
}: SuiAppProps) {
    const [showDisconnectApp, setShowDisconnectApp] = useState(false);
    const originLabel = useMiddleEllipsis(
        new URL(link).hostname,
        TRUNCATE_MAX_LENGTH,
        TRUNCATE_MAX_LENGTH - 1
    );
    const AppDetails = (
        <div className={cl(st.suiApp, st[displayType])}>
            <div className={st.icon}>
                {icon ? (
                    <img src={icon} className={st.icon} alt={name} />
                ) : (
                    <div className={st.defaultImg}></div>
                )}
            </div>
            <div className={st.info}>
                <div className={st.title}>{name} </div>
                {displayType === 'full' && (
                    <div className={st.description}>{description}</div>
                )}

                {displayType === 'card' && (
                    <div className={st.link}>{originLabel}</div>
                )}

                {displayType === 'full' && tags?.length && (
                    <div className={st.tags}>
                        {tags?.map((tag) => (
                            <div className={st.tag} key={tag}>
                                {tag}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
    return (
        <>
            {permissionID && showDisconnectApp ? (
                <DisconnectApp
                    name={name}
                    link={link}
                    icon={icon}
                    permissionID={permissionID}
                    setShowDisconnectApp={setShowDisconnectApp}
                />
            ) : null}
            {permissionID ? (
                <div
                    className={st.ecosystemApp}
                    onClick={() => setShowDisconnectApp(true)}
                >
                    {AppDetails}
                </div>
            ) : (
                <ExternalLink
                    href={link}
                    title={name}
                    className={st.ecosystemApp}
                    showIcon={false}
                    onClick={() => {
                        trackEvent('AppOpen', {
                            props: { name, source: 'AppPage' },
                        });
                    }}
                >
                    {AppDetails}
                </ExternalLink>
            )}
        </>
    );
}
