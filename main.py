import asyncio
import decky

class Plugin:
    async def _main(self):
        decky.logger.info("Kodi Launcher Plugin Started")

    async def _unload(self):
        decky.logger.info("Kodi Launcher Plugin Unloaded")

    async def launch_kodi(self) -> dict:
        decky.logger.info("launch_kodi called")
        try:
            decky.logger.info("Running request-kodi")
            process = await asyncio.create_subprocess_exec(
                '/usr/bin/request-kodi',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            stdout, stderr = await process.communicate()

            if process.returncode == 0:
                decky.logger.info("Successfully launched Kodi")
                return {"success": True, "message": "Kodi launched successfully"}
            else:
                error_msg = stderr.decode() if stderr else "Unknown error"
                decky.logger.error(f"Failed to launch Kodi: {error_msg}")
                return {"success": False, "message": f"Failed to launch Kodi: {error_msg}"}

        except Exception as e:
            decky.logger.error(f"Exception launching Kodi: {str(e)}")
            return {"success": False, "message": f"Error: {str(e)}"}
