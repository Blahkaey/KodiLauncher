import { definePlugin, callable } from "@decky/api";
import { staticClasses } from "@decky/ui";
import { patchMenu } from "./patches/menuPatch";
import { VFC } from "react";

const KodiIcon: VFC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "1em", height: "1em" }}>
  <path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5z"/>
  </svg>
);

// Create callable for backend communication
const launchKodi = callable<[], { success: boolean; message: string }>("launch_kodi");

export default definePlugin(() => {
  const unpatchMenu = patchMenu(launchKodi);

  return {
    name: "Kodi Launcher",
    titleView: <div className={staticClasses.Title}>Kodi Launcher</div>,
    content: <div></div>,
    icon: <KodiIcon />,
    onDismount() {
      unpatchMenu();
    },
  };
});
