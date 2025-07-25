import { afterPatch, findInReactTree, getReactRoot } from "@decky/ui"
import { FC, ReactNode, VFC, CSSProperties } from "react"

// Inline getReactTree function
const getReactTree = () => getReactRoot(document.getElementById('root') as any)

// Inline PluginIcon component
interface PluginIconProps {
    size?: string
    style?: CSSProperties
}

const PluginIcon: VFC<PluginIconProps> = ({ size, style }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} style={style} viewBox="0 0 50 50">
        <g transform="matrix(9.975962,0,0,10.061713,-224.35317,-226.61542)">
        <g transform="matrix(0.02,0,0,0.02,26.53,25.01)">
        <path
        fill='currentColor'
    d="m 431.521,293.719 c -0.791,2.568 -2.526,4.448 -4.384,6.299 -12.448,12.406 -24.857,24.852 -37.278,37.284 -4.476,4.478 -9.259,4.465 -13.752,-0.032 -12.82,-12.83 -25.641,-25.659 -38.456,-38.491 -4.366,-4.372 -4.364,-9.144 0.013,-13.526 12.888,-12.906 25.778,-25.809 38.671,-38.708 4.195,-4.198 9.124,-4.2 13.318,-0.004 12.499,12.501 24.979,25.02 37.499,37.496 1.859,1.852 3.586,3.741 4.369,6.31 z"
    transform="translate(-382.95,-292.02)"
    />
    </g>
    <g transform="matrix(0.02,0,0,0.02,25.02,26.52)">
    <path
    fill='currentColor'
    d="m 307.953,413.914 c -2.556,-0.812 -4.408,-2.582 -6.251,-4.436 -12.395,-12.458 -24.828,-24.877 -37.247,-37.312 -4.444,-4.45 -4.449,-9.198 -0.015,-13.638 12.855,-12.865 25.709,-25.729 38.567,-38.592 4.274,-4.274 9.171,-4.29 13.422,-0.037 12.856,12.864 25.711,25.729 38.563,38.597 4.415,4.421 4.428,9.264 0.031,13.664 -12.527,12.541 -25.075,25.066 -37.573,37.633 -1.789,1.798 -3.629,3.415 -6.123,4.12 h -3.374 z"
    transform="translate(-309.72,-365.32)"
    />
    </g>
    <g transform="matrix(0.02,0,0,0.02,25.03,23.95)">
    <path
    fill='currentColor'
    d="m 262.841,261.207 c 0,-14.303 0.129,-28.608 -0.081,-42.909 -0.061,-4.14 0.928,-7.374 4.089,-10.104 2.543,-2.198 4.797,-4.733 7.179,-7.118 9.423,-9.433 18.845,-18.867 28.271,-28.296 4.433,-4.432 9.213,-4.429 13.643,0.002 12.821,12.825 25.641,25.653 38.459,38.482 4.403,4.407 4.4,9.254 -0.003,13.663 -15.16,15.179 -30.326,30.356 -45.49,45.533 -13.391,13.405 -26.78,26.809 -40.173,40.212 -2.481,2.482 -4.679,1.905 -5.581,-1.536 -0.278,-1.066 -0.3,-2.219 -0.301,-3.332 -0.018,-14.866 -0.012,-29.732 -0.012,-44.597"
    transform="translate(-310.23,-240.83)"
    />
    </g>
    <g transform="matrix(0.02,0,0,0.02,22.95,25.01)">
    <path
    fill='currentColor'
    d="m 232.182,292.201 c 0,13.127 0.019,26.256 -0.026,39.383 -0.005,1.247 -0.203,2.567 -0.65,3.724 -0.876,2.279 -2.52,2.561 -4.241,0.844 -6.037,-6.027 -12.057,-12.071 -18.083,-18.107 -6.965,-6.977 -13.932,-13.953 -20.894,-20.934 -2.882,-2.889 -2.895,-6.898 -0.024,-9.801 12.82,-12.967 25.643,-25.933 38.472,-38.895 0.848,-0.857 1.648,-2.02 3.089,-1.475 1.378,0.52 1.922,1.763 2.118,3.141 0.122,0.854 0.218,1.722 0.22,2.583 0.013,13.179 0.009,26.359 0.009,39.537 z"
    transform="translate(-209.15,-292.03)"
    />
    </g>
    </g>
    </svg>
    )
}

interface MainMenuItemProps {
    route: string
    label: ReactNode
    onFocus: () => void
    onActivate?: () => void
}

interface MenuItemWrapperProps extends MainMenuItemProps {
    MenuItemComponent: FC<MainMenuItemProps>
    launchKodi: () => Promise<{ success: boolean; message: string }>
}

export const patchMenu = (launchKodi: () => Promise<{ success: boolean; message: string }>) => {
    console.log('[Kodi Launcher] Patching menu');

    const menuNode = findInReactTree(getReactTree(), (node) => node?.memoizedProps?.navID == 'MainNavMenuContainer')
    if (!menuNode || !menuNode.return?.type) {
        console.log('[Kodi Launcher] Menu Patch: Failed to find main menu root node.')
        return () => { }
    }
    const orig = menuNode.return.type
    let patchedInnerMenu: any
    const menuWrapper = (props: any) => {
        const ret = orig(props)
        if (!ret?.props?.children?.props?.children?.[0]?.type) {
            console.log('[Kodi Launcher] Menu Patch: The main menu element could not be found at the expected location. Valve may have changed it.')
            return ret
        }
        if (patchedInnerMenu) {
            ret.props.children.props.children[0].type = patchedInnerMenu
        } else {
            afterPatch(ret.props.children.props.children[0], 'type', (_: any, ret: any) => {
                if (!ret?.props?.children || !Array.isArray(ret?.props?.children)) {
                    console.log('[Kodi Launcher] Menu Patch: Could not find menu items to patch.')
                    return ret
                }
                const itemIndexes = getMenuItemIndexes(ret.props.children)
                const menuItemElement = findInReactTree(ret.props.children, (x) =>
                x?.type?.toString()?.includes('exactRouteMatch:'),
                );

                const newItem =
                <MenuItemWrapper
                    route="/kodi-launcher-no-route"
                    label='Kodi'
                    onFocus={menuItemElement.props.onFocus}
                    MenuItemComponent={menuItemElement.type}
                    launchKodi={launchKodi}
                />

                // Insert at position 3 (or customize as needed)
                ret.props.children.splice(itemIndexes[2], 0, newItem)

                return ret
            })
            patchedInnerMenu = ret.props.children.props.children[0].type
        }
        return ret
    }
    menuNode.return.type = menuWrapper
    if (menuNode.return.alternate) {
        menuNode.return.alternate.type = menuNode.return.type;
    }

    return () => {
        menuNode.return.type = orig
        menuNode.return.alternate.type = menuNode.return.type;
    }
}

function getMenuItemIndexes(items: any[]) {
    return items.flatMap((item, index) => (item && item.$$typeof && item.type !== 'div') ? index : [])
}

const MenuItemWrapper: FC<MenuItemWrapperProps> = ({ MenuItemComponent, label, launchKodi, ...props }) => {
    const handleLaunchKodi = async () => {
        try {
            const result = await launchKodi();
            if (!result.success) {
                console.error("[Kodi Launcher] Failed to launch Kodi:", result.message);
            }
        } catch (error) {
            console.error("[Kodi Launcher] Error calling launch_kodi:", error);
        }
    };

    return (
        <div
        //style={{ width: '100%' }}
        onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLaunchKodi();
        }}
        >

        {/* @ts-ignore - MenuItemComponent accepts children but types are incomplete */}
        <MenuItemComponent
        {...props}
        label={label}
        onActivate={handleLaunchKodi}
        >
            <PluginIcon/>
        </MenuItemComponent>
        </div>
    )
}
