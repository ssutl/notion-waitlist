# PROJECT TITLE

![image](src="https://github.com/ssutl/notion-waitlist/assets/76885270/009a63b8-e1c9-4f51-adb6-ae4fdc71529c")



# What it is
Create a waiting list page using notion as the CMS. Using notion as a CMS allows user interest to be easily guaged
before choosing to continue with project.

# Features Implemented

1. Waiting list -> NotionDB

2. FAQ management <-> NotionDB

3. Landing customisation <- NotionDB

# How to use it
	
1. Clone this repo

2. Edit the .env file 
	```
	NEXT_PUBLIC_NOTION_ACCESS_TOKEN=secret_123456789
	
	NEXT_PUBLIC_NOTION_CMS_DATABASE_ID=123456789
	```
3. Run `npm install`

4. Run`npm run dev`

> [!TIP]
> Create a notion integration and retrieve your access token.
	- [Notion Integration](https://developers.notion.com/docs/create-a-notion-integration)

> [!TIP]
> Copy the CMS database view URL and extract DB ID.
	- https://www.notion.so/123456789?v=2c7726cf9c6f463eb98340f828cbc1af&pvs=4
	- ID: 123456789
