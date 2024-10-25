export type CMS_NOTION_PAGE = {
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
    Youtube: {
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
    "Product name": {
      rich_text: {
        plain_text: string;
      }[]; // Consider defining a more detailed type
    };
    "Release date": {
      date: {
        start: string;
      } | null;
    };
    "Released product website": {
      url: string;
    };
    Description: {
      rich_text: {
        plain_text: string;
      }[]; // Consider defining a more detailed type
    };
  };
};

export type FAQ_NOTION_PAGE = {
  properties: {
    Reviewed: {
      checkbox: boolean;
    };
    Question: {
      title: {
        plain_text: string;
      }[];
    };
    Display: {
      checkbox: boolean;
    };
    Response: {
      rich_text: {
        plain_text: string;
      }[];
    };
    Email: {
      email: string;
    };
  };
};

export type FEATURE_NOTION_PAGE = {
  cover: {
    file: {
      url: string;
    };
    external: {
      url: string;
    };
  };
  properties: {
    Name: {
      title: {
        plain_text: string;
      }[];
    };
    Description: {
      rich_text: {
        plain_text: string;
      }[];
    };
    Date: {
      date: {
        start: string;
      };
    };
    Tags: {
      multi_select: {
        name: string;
      }[];
    };
  };
};
