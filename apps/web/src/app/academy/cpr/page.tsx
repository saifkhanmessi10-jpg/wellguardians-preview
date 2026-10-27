import type { Metadata } from "next";
import { PageHero } from "@/components/blocks";
import { photos } from "@/content/site";

export const metadata: Metadata = { title: "CPR & BLS", description: "American Heart Association CPR and BLS courses through our training-center partner." };

export default function CprPage() {
  return (
    <>
      {/* TODO(sabine): partner training-center name and booking link */}
      <PageHero title="CPR & BLS" lead="American Heart Association CPR, First Aid and BLS courses, offered through our AHA training-center partner." photo={photos.cpr}>
        <a href="/book?topic=training" className="btn-primary">Ask about upcoming classes</a>
      </PageHero>
      <section className="wrap mt-16 prose-wg">
        <h2>Who it's for</h2>
        <ul>
          <li>Students in our CNA program</li>
          <li>Family caregivers who want to be ready for an emergency</li>
          <li>Teams at clinics, agencies and churches</li>
        </ul>
        <p>Course cards are issued by the American Heart Association through the training center. Group sessions can be scheduled at your location.</p>
      </section>
    </>
  );
}
