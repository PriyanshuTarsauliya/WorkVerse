import React, { useEffect } from 'react';

/**
 * Google for Jobs SEO Integration
 * Injects Schema.org "JobPosting" JSON-LD structured microdata
 * into document head so search engines automatically index WorkVerse jobs.
 */
export default function JobPostingSchema({ job }) {
  useEffect(() => {
    if (!job) return;

    const schemaId = `job-schema-${job.id}`;
    let scriptTag = document.getElementById(schemaId);

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const jsonLd = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.title,
      "description": job.description,
      "datePosted": new Date().toISOString().split('T')[0],
      "validThrough": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "employmentType": job.jobType === 'FULL_TIME' ? 'FULL_TIME' : job.jobType === 'PART_TIME' ? 'PART_TIME' : 'OTHER',
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.company,
        "sameAs": "https://workverse.in"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.location || "Bengaluru",
          "addressCountry": "IN"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": job.salaryMin || 1500000,
          "maxValue": job.salaryMax || 3000000,
          "unitText": "YEAR"
        }
      }
    };

    scriptTag.text = JSON.stringify(jsonLd);

    return () => {
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [job]);

  return null;
}
