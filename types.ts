type AppEnv = {
  Variables: {
    loggedIn: boolean;
    isOwner: boolean;
  };
};

declare module "https://esm.sh/hono@4" {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      props?: {
        showHeader?: boolean;
        showFooter?: boolean;
        title?: string;
        stylesheet?: string;
      },
    ): Response | Promise<Response>;
  }
}

interface Micropost {
  id: number;
  raw_text: string;
  rendered_text: string;
  tags: string[];
  modified: number | null;
  is_deleted: 0 | 1;
}

export type { AppEnv, Micropost };