import { CvFormData } from "@/types/Cv";
import { Document, Page, Text, Link, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.6,
    backgroundColor: "#f5f7fa",
    color: "#1a1a1a",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#000000",
    color: "#ffffff",
    padding: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  contact: {
    fontSize: 12,
    color: "#ffffff",
    marginTop: 4,
  },
  columnsContainer: {
    flexDirection: "row",
    padding: 40,
    gap: 20,
  },
  leftColumn: {
    flex: 2,
    paddingRight: 10,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
  },
  item: {
    marginBottom: 5,
  },
  links:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 10
  }
});

const formatDate = (dateStr: string | undefined | null) => {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // fallback to raw string if invalid date
  return date.toLocaleString("default", { month: "short", year: "numeric" });
};

const ModernTemplate = ({ data }: { data: CvFormData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.name || "Your Name"}</Text>
        <Text style={styles.contact}>
          {[data.email, data.phone].filter(Boolean).join(" | ")}
        </Text>
        {data.location && <Text style={styles.contact}>{data.location}</Text>}
        {/* Optional social links */}
        <View style={styles.links}>
        {data.linkedin && (
          <Link
            src={data.linkedin}
            style={{
              color: "white",
              textDecoration: "underline",
              marginRight: 10,
            }}
          >
            LinkedIn
          </Link>
        )}
        {data.github && (
          <Link
            src={data.github}
            style={{ color: "white", textDecoration: "underline" }}
          >
            GitHub
          </Link>
        )}
        {data.portfolio && (
          <Link
            src={data.portfolio}
            style={{ color: "white", textDecoration: "underline" }}
          >
            Portfolio
          </Link>
        )}
        </View>
      </View>

      {/* Two-column layout */}
      <View style={styles.columnsContainer}>
        {/* Left Column */}
        <View style={styles.leftColumn}>
          {data.summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text>{data.summary}</Text>
            </View>
          )}

          {data.experience?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {data.experience.map((exp, i: number) => (
                <View key={i} style={styles.item}>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>{exp.role}</Text> at{" "}
                    {exp.company}
                  </Text>
                  <Text>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </Text>
                  <Text>{exp.description}</Text>
                </View>
              ))}
            </View>
          )}

          {data.projects?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {data.projects.map((proj, i: number) => (
                <View key={i} style={styles.item}>
                  <Text style={{ fontWeight: "bold" }}>{proj.name}</Text>
                  <Text>{proj.description}</Text>
                </View>
              ))}
            </View>
          )}

          {data.certificates?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {data.certificates.map((cert, i: number) => (
                <Text key={i} style={styles.item}>
                  •{" "}
                  {typeof cert === "object"
                    ? `${cert.name || ""}${
                        cert.issuer ? " - " + cert.issuer : ""
                      }`
                    : cert}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          {data.education?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {data.education.map((edu, i: number) => (
                <View key={i} style={styles.item}>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>{edu.degree}</Text>,{" "}
                    {edu.school}
                  </Text>
                  <Text>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {data.skills?.length > 0 && (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                {data.skills.map(
                (
                  skill:
                  | string
                  | { value?: string; label?: string },
                  i: number
                ) => (
                  <Text key={i}>
                    •{" "}
                    {typeof skill === "object"
                      ? skill.value || skill.label || JSON.stringify(skill)
                      : skill}
                  </Text>
                )
              )}
            </View>
          )}

          {data.languages?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <Text>{data.languages.join(", ")}</Text>
            </View>
          )}
        </View>
      </View>
    </Page>
  </Document>
);

export default ModernTemplate;
