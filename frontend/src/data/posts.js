export const FALLBACK_POSTS = [
  {
    id: 1,
    title: "Inside Our Atelier Upgrade",
    content:
      "After months of planning, our atelier refresh is complete. The renovation balances modern craft technology with the heritage details that define our brand.\n\nEach workstation now pairs digital pattern tools with bespoke tailoring equipment, giving our makers the flexibility to experiment without losing the tactile intuition that customers expect.\n\nWe also carved out a collaborative pit where design, merchandising, and production teams can review samples side by side. The result: faster iteration cycles, richer storytelling, and fewer compromises between concept and execution.",
    thumbnail:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    created_at: "2025-02-14T10:00:00Z",
  },
  {
    id: 2,
    title: "Heritage Collection 2025 Preview",
    content:
      "The 2025 Heritage Collection revisits silhouettes from our archive between 1995 and 2005, reinterpreting them through today's sustainability lens.\n\nExpect a palette anchored by deep indigo, clay, and rice paper white, with pops of citrus to elevate eveningwear. Fabrics include hand-loomed silk and organically dyed denim sourced from our long-term partners in Da Nang.\n\nWe will unveil the full line during the Ho Chi Minh Fashion Week showcase this March, accompanied by a capsule digital experience that lets customers trace the provenance of each look.",
    thumbnail:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    created_at: "2025-01-28T08:30:00Z",
  },
  {
    id: 3,
    title: "Scaling Sustainable Materials",
    content:
      "Our sustainability charter commits us to 80% traceable materials by 2026. To achieve that milestone, we have expanded partnerships with regenerative cotton farms in Ninh Thuan and bamboo fiber innovators in the Mekong delta.\n\nEvery supplier now participates in quarterly quality labs where we test for durability, color fastness, and hand feel. These labs help us maintain the luxurious touch that customers expect while staying true to our environmental goals.\n\nLooking ahead, we are investing in circular design pilots that explore take-back programs and recycling techniques tailored to the Southeast Asian climate.",
    thumbnail:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
    created_at: "2024-12-12T12:05:00Z",
  },
  {
    id: 4,
    title: "Ho Chi Minh Showroom Refresh",
    content:
      "We just reopened our District 1 showroom with immersive storytelling corners and custom tailoring stations. Guests enter through an archival gallery lined with campaign photography from the last 15 years.\n\nIn the center, modular storytelling corners host seasonal installations, from fabric touch labs to artisan demonstrations streamed live from the atelier.\n\nThe back of house now features private tailoring suites, each equipped with digital fitting mirrors that sync with our clienteling app for personalized recommendations.",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    created_at: "2024-11-20T09:40:00Z",
  },
  {
    id: 5,
    title: "Meet the Team: Master Pattern Maker",
    content:
      "Nguyen Thanh has spent 18 years shaping the fit of our signature jackets. We sat down with him to discuss the balance between precision and intuition in pattern making.\n\nThanh emphasizes close collaboration with fabric specialists: Every textile behaves differently. We drape, test, adjust, and then repeat until the garment moves with the wearer.\n\nHe also mentors new apprentices through a six-month rotation that includes digital drafting, manual adjustments, and real-world fittings with clients.",
    thumbnail:
      "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
    created_at: "2024-10-03T14:10:00Z",
  },
  {
    id: 6,
    title: "Tailoring Lab: From Sketch to Sample",
    content:
      "Our tailoring lab operates on a tight weekly cadence. Designers hand off sketches every Monday morning, and by Wednesday, the first muslin samples are ready for fittings.\n\nTo accelerate feedback loops, we use a hybrid approach: digital avatars for initial proportion checks, followed by live fittings where clients can react to the drape and balance.\n\nEach iteration is tracked in a shared digital workbook that captures adjustments, material notes, and client feedback, ensuring nothing gets lost as the garment evolves.",
    thumbnail:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    created_at: "2024-09-12T07:55:00Z",
  },
  {
    id: 7,
    title: "Community Workshop Recap",
    content:
      "Highlights from our styling workshop with emerging designers and clients in Ho Chi Minh City. Participants experimented with deadstock fabrics, learning how to repurpose them into capsule wardrobe staples while minimizing waste.\n\nThe event closed with a roundtable on inclusive sizing, producing actionable insights that our product team is already testing for the Resort 2026 line.",
    thumbnail:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    created_at: "2024-08-18T16:20:00Z",
  },
  {
    id: 8,
    title: "Inside the Fabric Lab",
    content:
      "Before any fabric reaches production, it spends two weeks in our lab for stress testing. We evaluate stretch recovery, pilling resistance, and color stability under UV exposure.\n\nLab findings feed directly into our design decisions. If a fabric needs reinforcement, we adjust seam placements or add hidden structure to maintain comfort.\n\nThe lab also powers our digital material library, giving teams across the company instant access to swatches, test results, and supplier certifications.",
    thumbnail:
      "https://images.unsplash.com/photo-1475189778702-5ec9941484ae?auto=format&fit=crop&w=1200&q=80",
    created_at: "2024-07-05T11:25:00Z",
  },
];

export const findFallbackPost = (identifier) => {
  if (!identifier) {
    return null;
  }

  const target = identifier.toString();
  return FALLBACK_POSTS.find((post) => post.id.toString() === target) || null;
};

export default FALLBACK_POSTS;
