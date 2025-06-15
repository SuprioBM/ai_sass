import { CvFormData } from "@/types/Cv";
import { Document, Page, Text, View, StyleSheet,Link } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 1.5,
    backgroundColor: "#fff",
    color: "#222",
  },
  leftColumn: {
    width: "30%",
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    borderRightStyle: "solid",
  },
  rightColumn: {
    width: "70%",
    paddingLeft: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
    color: "#555",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    paddingBottom: 3,
  },
  item: {
    marginBottom: 6,
  },
  contactText: {
    fontSize: 11,
    marginBottom: 4,
    color: "black"
  },
  skillList: {
    fontSize: 11,
    lineHeight: 1.3,
  },
});

const StylishTemplate = ({ data }: { data: CvFormData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Left Sidebar */}
      <View style={styles.leftColumn}>
        <Text style={styles.name}>{data.name || "Your Name"}</Text>
        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Link src={`mailto:${data.email}`} style={styles.contactText}>
            {data.email || "email@example.com"}
          </Link>
          <Text style={styles.contactText}>{data.phone || "+1234567890"}</Text>
          <Text style={styles.contactText}>{data.location || "Location"}</Text>
          {data.portfolio && (
            <Link src={data.portfolio} style={styles.contactText}>Portfolio</Link>
          )}
          {data.linkedin && (
            <Link src={data.linkedin} style={styles.contactText}>LinkedIn</Link>
          )}
          {data.github && (
            <Link src={data.github} style={styles.contactText}>GitHub</Link>
          )}
        </View>

        {/* Skills */}
        {data.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {data.skills.map(
              (
                skill:
                  | string
                  | { value?: string; label?: string; [key: string]: any },
                i: number
              ) => (
                <Text style={styles.skillList} key={i}>
                  •{" "}
                  {typeof skill === "object"
                    ? skill.value || skill.label || JSON.stringify(skill)
                    : skill}
                </Text>
              )
            )}
          </View>
        )}

        {/* Languages */}
        {data.languages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {data.languages.map((lang: string, i: number) => (
              <Text key={i} style={styles.contactText}>
                {lang}
              </Text>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certificates?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certificates.map(
              (
                cert:
                  | string
                  | { name?: string; issuer?: string; [key: string]: any },
                i: number
              ) => (
                <Text key={i} style={styles.contactText}>
                  {typeof cert === "object"
                    ? `• ${cert.name || ""}${
                        cert.issuer ? ` - ${cert.issuer}` : ""
                      }`
                    : `• ${cert}`}
                </Text>
              )
            )}
          </View>
        )}

        {/* Hobbies */}
        {(data.hobbies ?? []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hobbies</Text>
            {(data.hobbies ?? []).map((hobby: string, i: number) => (
              <Text key={i} style={styles.contactText}>
                {hobby}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Right Main Content */}
      <View style={styles.rightColumn}>
        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp: any, i: number) => (
              <View key={i} style={styles.item}>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>{exp.role}</Text> at{" "}
                  {exp.company}
                </Text>
                <Text style={{ fontSize: 10, color: "#666" }}>
                  {exp.startDate} - {exp.endDate || "Present"}
                </Text>
                <Text>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu: any, i: number) => (
              <View key={i} style={styles.item}>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>{edu.degree}</Text>,{" "}
                  {edu.school}
                </Text>
                <Text style={{ fontSize: 10, color: "#666" }}>
                  {edu.startDate} - {edu.endDate || "Present"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((proj: any, i: number) => (
              <View key={i} style={styles.item}>
                <Text style={{ fontWeight: "bold" }}>{proj.name}</Text>
                <Text>{proj.description}</Text>
                {proj.tools && (
                  <Text style={{ fontSize: 10, color: "#666" }}>
                    Tools: {proj.tools.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  </Document>
);

export default StylishTemplate;
