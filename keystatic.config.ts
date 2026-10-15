import { config, fields, collection } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugField(label: string, min: number, max: number) {
  return fields.slug({
    name: {
      label,
      validation: { isRequired: true, length: { min, max } },
    },
    slug: {
      description: "Lowercase words separated by hyphens.",
      validation: {
        pattern: {
          regex: slugPattern,
          message: "Use lowercase words separated by hyphens.",
        },
      },
    },
  });
}

// MDX components available in bodies; must match components/mdx.tsx
const mdxComponents = {
  Figure: block({
    label: "Figure",
    description: "An illustration from public/images/ with a caption.",
    schema: {
      src: fields.text({ label: "Image path", description: "Starts with /images/" }),
      alt: fields.text({ label: "Alt text" }),
      caption: fields.text({ label: "Caption", multiline: true }),
      width: fields.text({ label: "Width (px)", defaultValue: "1200" }),
      height: fields.text({ label: "Height (px)", defaultValue: "675" }),
    },
  }),
};

const technologyField = fields.text({
  label: "Technology",
  validation: { length: { min: 1, max: 50 } },
});

export default config({
  storage: { kind: "local" },
  collections: {
    articles: collection({
      label: "Articles",
      slugField: "title",
      path: "content/articles/*",
      format: { contentField: "body" },
      schema: {
        title: slugField("Title", 5, 120),
        description: fields.text({
          label: "Description",
          description: "20 to 200 characters. Used as the meta description.",
          multiline: true,
          validation: { length: { min: 20, max: 200 } },
        }),
        published: fields.date({
          label: "Content published",
          validation: { isRequired: true },
        }),
        updated: fields.date({ label: "Updated (optional)" }),
        tags: fields.array(
          fields.text({
            label: "Tag",
            validation: { length: { min: 1, max: 40 } },
          }),
          {
            label: "Tags",
            itemLabel: (props) => props.value,
            validation: { length: { min: 1 } },
          }
        ),
        draft: fields.checkbox({ label: "Draft", defaultValue: false }),
        related: fields.array(
          fields.relationship({ label: "Related article", collection: "articles" }),
          { label: "Related articles", itemLabel: (props) => props.value ?? "" }
        ),
        body: fields.mdx({ label: "Body", components: mdxComponents }),
      },
    }),
    caseStudies: collection({
      label: "Case Studies",
      slugField: "title",
      path: "content/case-studies/*",
      format: { contentField: "body" },
      schema: {
        title: slugField("Title", 5, 120),
        description: fields.text({
          label: "Description",
          multiline: true,
          validation: { length: { min: 20, max: 200 } },
        }),
        published: fields.date({
          label: "Content published",
          validation: { isRequired: true },
        }),
        updated: fields.date({ label: "Updated (optional)" }),
        role: fields.text({
          label: "Role",
          description: 'For example, "Founder, product strategy and engineering".',
          validation: { length: { min: 1, max: 160 } },
        }),
        stack: fields.array(technologyField, {
          label: "Stack",
          itemLabel: (props) => props.value,
          validation: { length: { min: 1 } },
        }),
        draft: fields.checkbox({ label: "Draft", defaultValue: false }),
        related: fields.array(
          fields.relationship({ label: "Related article", collection: "articles" }),
          { label: "Related articles", itemLabel: (props) => props.value ?? "" }
        ),
        body: fields.mdx({ label: "Body", components: mdxComponents }),
      },
    }),
    products: collection({
      label: "Products",
      slugField: "title",
      path: "content/products/*",
      format: { contentField: "body" },
      schema: {
        title: slugField("Name", 2, 80),
        description: fields.text({
          label: "Description",
          multiline: true,
          validation: { length: { min: 20, max: 240 } },
        }),
        url: fields.url({ label: "URL (optional)" }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Sunsetted", value: "sunsetted" },
          ],
          defaultValue: "active",
        }),
        order: fields.integer({
          label: "Sort order",
          defaultValue: 0,
          validation: { min: 0 },
        }),
        stack: fields.array(technologyField, {
          label: "Stack",
          itemLabel: (props) => props.value,
        }),
        published: fields.date({
          label: "Content published",
          validation: { isRequired: true },
        }),
        updated: fields.date({ label: "Updated (optional)" }),
        body: fields.mdx({ label: "Engineering story", components: mdxComponents }),
      },
    }),
  },
});
