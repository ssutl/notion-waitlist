export type NotionPage = {
  object: string;
  id: string;
  cover: {
    external: {
      url: string;
    };
    file: {
      url: string;
    };
  };
  icon: {
    type: string;
    emoji: string;
  };
  properties: {
    Meta: {
      formula: any; // Replace 'any' with a more specific type if the formula object structure is known
    };
    X: {
      url: null | string;
    };
    ID: {
      unique_id: any; // Replace 'any' with a more specific type if the unique_id object structure is known
    };
    Instagram: {
      url: null | string;
    };
    "Main text": {
      rich_text: {
        plain_text: string;
      }[]; // Consider defining a more detailed type
    };
    Description: {
      rich_text: {
        plain_text: string;
      }[]; // Consider defining a more detailed type
    };
  };
};
