import { CvFormData } from "@/types/Cv";
import { Document, Page, Text,Link, View, StyleSheet } from "@react-pdf/renderer";

const creativeStyles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#2e3440",
    color: "#eceff4",
    padding: 30,
  },
  sidebar: {
    width: "30%",
    backgroundColor: "#3b4252",
    padding: 20,
  },
  main: {
    width: "70%",
    padding: 20,
  },
  name: {
    fontSize: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#88c0d0",
    marginTop: 10,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  item: {
    fontSize: 10,
    marginBottom: 3,
  },
  link: {
    fontSize: 10,
    marginBottom: 3,
    color: "#81a1c1",
  },
});

export const CreativeTemplate = ({ data }: { data: CvFormData }) => (
  <Document>
    <Page size="A4" style={creativeStyles.page}>
      {/* Sidebar */}
      <View style={creativeStyles.sidebar}>
        <Text style={creativeStyles.name}>{data.name}</Text>
        <Link src={`mailto:${data.email}`} style={creativeStyles.item}>
            {data.email || "email@example.com"}
        </Link>
        <Text style={creativeStyles.item}>{data.phone}</Text>
        <Text style={creativeStyles.item}>{data.location}</Text>

        {/* Skills */}
        {data.skills?.length > 0 && (
          <>
            <Text style={creativeStyles.sectionTitle}>Skills</Text>
            {data.skills.map((skill: string, i: number) => (
              <Text key={i} style={creativeStyles.item}>
                • {skill}
              </Text>
            ))}
          </>
        )}

        {/* Links */}
        {(data.linkedin || data.github || data.portfolio) && (
          <>
            <Text style={creativeStyles.sectionTitle}>Links</Text>
            {data.linkedin && (
              <Link src= {data.linkedin} style={creativeStyles.link}>LinkedIn</Link>
            )}
            {data.github && (
              <Link src={data.github} style={creativeStyles.link}>GitHub</Link>
            )}
            {data.portfolio && (
              <Link src={data.portfolio} style={creativeStyles.link}>
                Portfolio
              </Link>
            )}
          </>
        )}
      </View>

      {/* Main Content */}
      <View style={creativeStyles.main}>
        {/* Summary */}
        {data.summary && (
          <>
            <Text style={creativeStyles.sectionTitle}>Summary</Text>
            <Text style={creativeStyles.item}>{data.summary}</Text>
          </>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <>
            <Text style={creativeStyles.sectionTitle}>Experience</Text>
            {data.experience.map((exp, i: number) => (
              <View key={i}>
                <Text style={creativeStyles.item}>
                  {exp.role} at {exp.company}
                </Text>
                <Text style={creativeStyles.item}>
                  {exp.startDate} - {exp.endDate}
                </Text>
                {exp.description && (
                  <Text style={creativeStyles.item}>{exp.description}</Text>
                )}
              </View>
            ))}
          </>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <>
            <Text style={creativeStyles.sectionTitle}>Education</Text>
            {data.education.map((edu, i: number) => (
              <View key={i}>
                <Text style={creativeStyles.item}>
                  {edu.degree}, {edu.school}
                </Text>
                <Text style={creativeStyles.item}>
                  {edu.startDate} - {edu.endDate || "Present"}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <>
            <Text style={creativeStyles.sectionTitle}>Projects</Text>
            {data.projects.map((proj, i: number) => (
              <View key={i}>
                <Text style={creativeStyles.item}>{proj.name}</Text>
                <Text style={creativeStyles.item}>{proj.description}</Text>
              </View>
            ))}
          </>
        )}

        {/* Certifications */}
        {data.certificates?.length > 0 && (
          <>
            <Text style={creativeStyles.sectionTitle}>Certifications</Text>
            {data.certificates.map((cert, i: number) => (
              <View key={i}>
                <Text style={creativeStyles.item}>{cert.name}</Text>
                <Text style={creativeStyles.item}>{cert.issuer}</Text>
              </View>
            ))}
          </>
        )}

        {/* Languages */}
        {data.languages?.length > 0 && (
          <>
            <Text style={creativeStyles.sectionTitle}>Languages</Text>
            <Text style={creativeStyles.item}>{data.languages.join(", ")}</Text>
          </>
        )}
      </View>
    </Page>
  </Document>
);
