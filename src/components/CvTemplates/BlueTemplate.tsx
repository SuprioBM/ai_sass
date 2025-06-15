// components/CvDocument.tsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  Link,
} from "@react-pdf/renderer";
import { CvFormData } from "@/types/Cv";

// Register fonts (you'll need to host these fonts locally or link to them)
// You can download Roboto fonts or use any professional font you like
Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/Roboto-Regular.ttf" },
    { src: "/fonts/Roboto-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/Roboto-Italic.ttf", fontStyle: "italic" },
  ],
});

// Color palette
const colors = {
  primary: "#2c3e50", // dark navy blue
  secondary: "#2980b9", // bright blue accent
  lightGray: "#ecf0f1",
  darkGray: "#7f8c8d",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 11,
    lineHeight: 1.5,
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 40,
    backgroundColor: "#fff",
    color: colors.primary,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 10,
    color: colors.darkGray,
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    marginVertical: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
    paddingBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  twoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftColumn: {
    width: "65%",
    paddingRight: 20,
  },
  rightColumn: {
    width: "30%",
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: colors.lightGray,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 12,
  },
  itemDate: {
    fontSize: 10,
    color: colors.darkGray,
  },
  bulletPoint: {
    marginLeft: 12,
    marginBottom: 4,
    fontSize: 11,
  },
  skillItem: {
    marginBottom: 4,
    fontSize: 11,
  },
  summaryText: {
    fontSize: 12,
    fontStyle: "italic",
    color: colors.darkGray,
    marginBottom: 12,
  },
  links:{
    display: "flex",
    flexDirection: "row",
   

  }
});

export default function MinimalisticTemplate({ data }: { data: CvFormData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER: Name, Title & Contact */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.header}>{data.name || "Your Name"}</Text>
          <Link src={`mailto:${data.email}`} style={styles.contactInfo}>
                      {data.email || "email@example.com"}
                    </Link>
          
          <Text style={styles.contactInfo}>
            {data.phone || "+1 234 567 890"}
          </Text>
          <View style={styles.links}>
          {data.portfolio && (
            <Link src={data.portfolio} >Portfolio | </Link>
          )}
          {data.linkedin && (
            <Link src={data.linkedin} >Linkedin | </Link>
          )}
          {data.github && (
            <Link src={data.github} >Github</Link>
          )}
          </View>
          {data.location && (
            <Text style={styles.contactInfo}>{data.location}</Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* MAIN CONTENT: Two columns */}
        <View style={styles.twoColumn}>
          {/* LEFT SIDE: Summary, Experience, Education */}
          <View style={styles.leftColumn}>
            {/* Summary */}
            {data.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Summary</Text>
                <Text style={styles.summaryText}>{data.summary}</Text>
              </View>
            )}

            {/* Experience */}
            {data.experience?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.experience.map((exp: any, i: number) => (
                  <View key={i} style={{ marginBottom: 10 }}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>
                        {exp.role} @ {exp.company}
                      </Text>
                      <Text style={styles.itemDate}>
                        {exp.startDate} - {exp.endDate || "Present"}
                      </Text>
                    </View>
                    {exp.description && (
                      <View>
                        {exp.description
                          .split("\n")
                          .map((line: string, idx: number) => (
                            <Text key={idx} style={styles.bulletPoint}>
                              • {line}
                            </Text>
                          ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {data.education?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu: any, i: number) => (
                  <View key={i} style={{ marginBottom: 10 }}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{edu.degree}</Text>
                      <Text style={styles.itemDate}>
                        {edu.startDate} - {edu.endDate || "Present"}
                      </Text>
                    </View>
                    <Text>{edu.school}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* RIGHT SIDE: Skills and maybe Certifications or Languages */}
          <View style={styles.rightColumn}>
            {/* Skills */}
            {data.skills?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                {data.skills.map((skill: any, i: number) => (
                  <Text key={i} style={styles.skillItem}>
                    • {typeof skill === "object" ? skill.value : skill}
                  </Text>
                ))}
              </View>
            )}

            {/* Certifications */}
            {data.certificates?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {data.certificates.map((cert: any, i: number) => (
                  <Text key={i} style={styles.skillItem}>
                    • {cert.name} - {cert.issuer || "Self-issued"}
                  </Text>
                ))}
              </View>
            )}

            {/* Languages */}
            {data.languages?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                {data.languages.map((lang: any, i: number) => (
                  <Text key={i} style={styles.skillItem}>
                    • {lang}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Footer with page number or contact (optional) */}
      </Page>
    </Document>
  );
}
