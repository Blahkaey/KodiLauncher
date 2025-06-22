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
        <path fill='currentColor' d="m7.95,6.7c2.03.11,4.04.31,5.96.68.97-1.08,2.35-1.78,3.9-1.83.33-.9.69-1.81,1.09-2.73.33-.76.76-1.56,1.25-2.35-4.66.91-8.86,3.13-12.2,6.24Z" />
        <path fill='currentColor' d="m16.05,34.46c-1.36-5.44-1.96-11.74-.9-18.73-.29-.18-.56-.38-.81-.6-5.38,3.4-11.67,9.74-13.08,17.73.62,1.87,1.45,3.63,2.46,5.28,2.63.59,6.29.8,10.26.53.03-1.7.83-3.21,2.07-4.2Z" />
        <path fill='currentColor' d="m38.57,36.48c-.09,0-.17.01-.26.01-1.04,0-2.02-.3-2.85-.8-.28.21-.56.43-.86.64-2.84,2.02-6.34,3.51-10.06,4.55-.29.7-.73,1.32-1.26,1.83,1.36,2.9,2.8,5.32,3.97,7.17,4.82-.43,9.24-2.23,12.88-5-.29-2.73-.78-5.57-1.56-8.4Z" />
        <path fill='currentColor' d="m12.54,11.54c-.01-.12-.01-.23-.02-.35-2.51-.42-5.25-.56-7.96-.61C1.75,14.56.08,19.4,0,24.63c3.12-5.8,8.12-10.34,12.54-13.09Z" />
        <path fill='currentColor' d="m22.1,14.72c-.77.86-1.81,1.47-2.99,1.71-.92,6.25-.4,11.92.81,16.85,2.13.17,3.91,1.55,4.66,3.45,2.84-.89,5.5-2.09,7.7-3.66.26-.18.5-.37.75-.56-.14-.48-.22-1-.22-1.52,0-1.61.7-3.06,1.8-4.06-2.78-4.76-6.79-9.05-12.52-12.21Z" />
        <path fill='currentColor' d="m19.56,44.25s-.06,0-.09,0c-1.57,0-2.99-.66-3.99-1.72-1.63.15-3.24.23-4.79.23-1.19,0-2.33-.05-3.42-.13,3.99,4.01,9.33,6.67,15.28,7.25-.95-1.61-1.99-3.49-2.99-5.62Z" />
        <path fill='currentColor' d="m23.95,11.21c6.1,3.39,10.94,8.2,14.39,14.28.5,0,.98.08,1.44.2,2.9-4.05,4.29-8.2,4.82-11.69-7.63-4.16-14.92-4.12-20.65-2.79Z" />
        <path fill='currentColor' d="m48.23,16.3c-.8,3.74-2.43,7.83-5.26,11.78.53.85.84,1.84.84,2.91,0,1.5-.6,2.87-1.58,3.86.62,2.14,1.12,4.37,1.48,6.7,3.91-4.41,6.28-10.21,6.28-16.56,0-2.98-.52-5.84-1.48-8.5-.09-.07-.18-.13-.28-.2Z" />
        <path fill='currentColor' d="m22.57,4.4c-.36.83-.68,1.65-.98,2.47.23.19.44.4.63.63,6.15-1.59,14.03-1.96,22.35,1.96C40.07,3.78,33.15.11,25.36,0c-1.17,1.48-2.2,3.02-2.79,4.4Z" />
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
                route=""
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
