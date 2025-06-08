import { Document, Page, Text, Link,View, StyleSheet } from "@react-pdf/renderer";

const classicStyles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Times-Roman",
    fontSize: 12,
    lineHeight: 1.5,
    color: "#000000",
  },
  name: {
    fontSize: 22,
    marginBottom: 4,
  },
  contact: {
    display: "flex",
    flexDirection: "row",
    color: "black"
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 6,
    textDecoration: "underline",
  },
  item: {
    marginBottom: 4,
  },
  
});

export const ClassicTemplate = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={classicStyles.page}>
      <Text style={classicStyles.name}>{data.name}</Text>
      <Text style={classicStyles.contact}>
        {data.email} | {data.phone} | {data.location}
      </Text>
     <View style={classicStyles.contact}>
      {data.linkedin && (
        <>
          <Link src={data.linkedin} style={classicStyles.contact}>
            LinkedIn
          </Link>
          {(data.github || data.portfolio) && <Text> | </Text>}
        </>
      )}

      {data.github && (
        <>
          <Link src={data.github} style={classicStyles.contact}>
            GitHub
          </Link>
          {data.portfolio && <Text> | </Text>}
        </>
      )}

      {data.portfolio && (
        <Link src={data.portfolio} style={classicStyles.contact}>
          Portfolio
        </Link>
      )}
      </View>

      {data.summary && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Professional Summary</Text>
          <Text>{data.summary}</Text>
        </View>
      )}

      {data.experience?.length > 0 && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Work Experience</Text>
          {data.experience.map((exp: any, i: number) => (
            <View key={i} style={classicStyles.item}>
              <Text>
                • {exp.role}, {exp.company} ({exp.startDate} - {exp.endDate})
              </Text>
              {exp.description && <Text>{exp.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {data.education?.length > 0 && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Education</Text>
          {data.education.map((edu: any, i: number) => (
            <Text key={i} style={classicStyles.item}>
              • {edu.degree}, {edu.school} ({edu.startDate} -{" "}
              {edu.endDate || "Present"})
            </Text>
          ))}
        </View>
      )}

      {data.projects?.length > 0 && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Projects</Text>
          {data.projects.map((proj: any, i: number) => (
            <Text key={i} style={classicStyles.item}>
              • {proj.name}: {proj.description}
            </Text>
          ))}
        </View>
      )}

      {data.certificates?.length > 0 && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Certifications</Text>
          {data.certificates.map((cert: any, i: number) => (
            <Text key={i} style={classicStyles.item}>
              • {cert.name} - {cert.issuer}
            </Text>
          ))}
        </View>
      )}

      {data.skills?.length > 0 && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Skills</Text>
          <Text>{data.skills.join(", ")}</Text>
        </View>
      )}

      {data.languages?.length > 0 && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Languages</Text>
          <Text>{data.languages.join(", ")}</Text>
        </View>
      )}
    </Page>
  </Document>
);
