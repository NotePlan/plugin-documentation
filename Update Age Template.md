---
title: Update Age
type: template-runner
getNoteTitled: <current>
writeUnderHeading: Age
location: replace
---

<%
// Get frontmatter attributes to access Bday
const attrs = frontmatter.getFrontmatterAttributes(Editor);
const bday = attrs.Bday || attrs.bday || '';

// Calculate age using the user's formula: (date.daysBetween(date.now("YYYY-MM-DD"), Bday)/-365)
let age = '';
if (bday) {
const daysBetween = date.daysBetween(date.now("YYYY-MM-DD"), bday);
// Use the formula as provided, ensuring positive age
age = Math.floor(Math.abs(daysBetween / -365));
}

// Get the template title for the x-callback URL
const templateTitle = "Update Age";
const encodedTitle = encodeURIComponent(templateTitle);

// Create the x-callback URL
const callbackUrl = `noteplan://x-callback-url/runPlugin?pluginID=np.Templating&command=templateRunner&arg0=${encodedTitle}&arg1=true`;
%>

<%- age %> [Update](<%- callbackUrl %>)
