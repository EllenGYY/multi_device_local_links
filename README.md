### Multi-Device Local Links (Obsidian Plugin)

Obsidian offers excellent support for local file and folder links. You simply need to drag them into your Obsidian Markdown file while holding **Ctrl** on Windows or **Option** on Mac. However, when you're working across multiple platforms and each has its own local link to a project you're tracking outside the vault—such as a project managed with Git—it can become cumbersome. You may end up with multiple local folder links in your Markdown file, some of which won't work because you're not on the corresponding platform.

To address this issue, I developed a simple plugin that uses the DataviewJS inline function to determine whether specific content should appear on a particular device. 

![](.\DemoAssets\teaser.png)



Here are the steps to use this plugin:

1. Download the plugin from the "Releases" section of this GitHub repository, then drag it into the **plugins** folder inside your **.obsidian** folder within your workspace.

2. Enable the plugin in the settings.

3. Also make sure [**Dataview**](https://github.com/blacksmithgu/obsidian-dataview) plugin is already installed, and the JavaScript queries and inline JavaScript queries is toggled to on.

   ![](.\DemoAssets\dataviewsettings.png)

4. Assign a unique name to your current device under this plugin's settings (each device should have its own name).

   ![](.\DemoAssets\devicenamesettings.png)

5. To allow DataviewJS to read the current device name, the plugin automatically writes the device name to a file under **DeviceSettings/DeviceSettings.md**. To prevent this from being synced across devices, add this directory to the **Paths to Ignore** in your sync settings. I personally use the **Remotely Save** plugin, but I believe the official Obsidian sync service also offers this feature.

   ![](.\DemoAssets\excludedir.png)

6. To add device-specific content, select the content, right-click, and choose **Only show on current device**. This will convert the content into an inline DataviewJS block, allowing you to edit it in source code mode if needed.

   ![](.\DemoAssets\rightclickmenu.png)

