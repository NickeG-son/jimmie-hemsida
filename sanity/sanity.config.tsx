import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import type { StructureBuilder, StructureResolverContext } from "sanity/structure";
import category from "./schemas/category";
import galleryImage from "./schemas/galleryImage";
import { User, FileImage, Upload, Mail, Home, Menu, FolderOpen, FileText } from "lucide-react";
import menuItems from "./schemas/menuItems";
import page from "./schemas/page";
import contactSubmission from "./schemas/contactSubmission";
import heroSlide from "./schemas/heroSlide";
import { MassUploadTool } from "./tools/massUploadTool";
import { ContactTool } from "./tools/contactTool";

function InloggLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" }}>
      <User size={24} />
      JimmieJimmie.com
    </div>
  );
}

const myStructure = (S: StructureBuilder, context: StructureResolverContext) =>
  S.list()
    .title("Innehåll")
    .items([
      // 1. Startsida
      S.listItem()
        .title("Startsida")
        .icon(Home)
        .child(S.documentTypeList("heroSlide").title("Startsida")),

      S.divider(),

      // 2. Menyval
      S.listItem()
        .title("Menyval")
        .icon(Menu)
        .child(S.documentTypeList("menuItem").title("Menyval")),

      // 3. Kategorier
      S.listItem()
        .title("Kategorier")
        .icon(FolderOpen)
        .child(S.documentTypeList("category").title("Kategorier")),

      // 4. Fotografier per Kategori (folder view)
      S.listItem()
        .title("Fotografier per Kategori")
        .icon(FileImage)
        .child(
          S.documentTypeList("category")
            .title("Kategorier (Mappar)")
            .child(async (categoryId) => {
              const client = context.getClient({ apiVersion: "2024-01-01" });
              const cat = await client.fetch<{ isAggregated?: boolean }>(
                `*[_id == $id][0]{ isAggregated }`,
                { id: categoryId }
              );

              if (cat?.isAggregated) {
                return S.documentList()
                  .title("Alla Fotografier (aggregerad)")
                  .filter('_type == "galleryImage"');
              }

              return S.documentList()
                .title("Fotografier")
                .filter('_type == "galleryImage" && category._ref == $categoryId')
                .params({ categoryId })
                .initialValueTemplates([
                  S.initialValueTemplateItem("galleryImage-by-category", { categoryId }),
                ]);
            })
        ),

      S.divider(),

      // 5. Sidor
      S.listItem()
        .title("Sidor")
        .icon(FileText)
        .child(S.documentTypeList("page").title("Sidor")),
    ]);

export default defineConfig({
  basePath: "/studio", // <-- The URL path where your friend will go to log in!
  projectId: "gr97dtx7", //  <-- Replace this!
  dataset: "production",
  name: "jimmiejimmie",
  title: "JimmieJimmie.com",
  // We will plug our 'schemas' in here on the next step:
  studio: {
    components: {
      logo: InloggLogo,
    },
  },
  schema: {
    types: [category, galleryImage, menuItems, page, contactSubmission, heroSlide],
    templates: (prev) => [
      ...prev,
      {
        id: "galleryImage-by-category",
        title: "Fotografi med vald kategori",
        schemaType: "galleryImage",
        parameters: [{ name: "categoryId", type: "string" }],
        value: (params: Record<string, any>) => ({
          category: {
            _type: "reference",
            _ref: params.categoryId,
          },
        }),
      },
    ],
  },
  plugins: [structureTool({ title: "Innehåll", structure: myStructure })],
  tools: (prev) => {
    const next = prev.filter((tool) => tool.name !== "releases");
    return [
      ...next,
      {
        name: "mass-upload",
        title: "Filhantering",
        icon: Upload,
        component: MassUploadTool,
      },
      {
        name: "contact-submissions",
        title: "Meddelanden",
        icon: Mail,
        component: ContactTool,
      },
    ];
  },
});

