package ie.tcd.kdeg.r2rmleditor.pages;

import java.io.PrintWriter;
import java.io.StringWriter;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.jena.rdf.model.Model;
import org.apache.tapestry5.annotations.Component;
import org.apache.tapestry5.annotations.Environmental;
import org.apache.tapestry5.annotations.Property;
import org.apache.tapestry5.corelib.components.Zone;
import org.apache.tapestry5.hibernate.annotations.CommitAfter;
import org.apache.tapestry5.ioc.annotations.Inject;
import org.apache.tapestry5.services.javascript.JavaScriptSupport;
import org.hibernate.Session;

import ie.tcd.kdeg.r2rmleditor.entities.Mapping;
import ie.tcd.kdeg.r2rmleditor.entities.MappingExecution;
import r2rml.engine.Configuration;
import r2rml.engine.R2RMLProcessor;

public class EditMapping extends BasePage {

	@Property
	private Mapping mapping;

	@Inject
	private Session session;

	// fields for changing the information
	@Component
	private Zone informationZone;

	// fields for changing the configuration
	@Component
	private Zone configurationZone;

	// fields for changing the mapping
	@Component
	private Zone editorZone;

	@Environmental
	private JavaScriptSupport javaScriptSupport;

	private boolean run;

	void onActivate(long id) {
		// Get the mapping when page loads...
		mapping = (Mapping) session.get(Mapping.class, id);
	}

	Object[] onPassivate() {
		return new Object[] { mapping.getId() };
	}

	@CommitAfter
	public Object onSuccessFromEditInformation(long id) {
		session.update(mapping);
		return informationZone.getBody();
	}

	@CommitAfter
	public Object onSuccessFromEditConfiguration(long id) {
		session.update(mapping);
		return configurationZone.getBody();
	}

	@CommitAfter
	public Object onSuccessFromSaveMapping(long id) {
		session.update(mapping);
		if (run) {
			// Log execution
			String output = saveMappingExecution(mapping).getOutput();
			mapping.setOutput(StringEscapeUtils.escapeHtml(output));
		}
		return editorZone.getBody();
	}

	private MappingExecution saveMappingExecution(Mapping mapping) {
		String output = null;
		MappingExecution mappingExecution = new MappingExecution();
		try {

			// write mapping that can be used in R2RML processor
			// FileUtils.writeStringToFile(new File("mapping.ttl"),
			// mapping.getR2rmlMapping());

			// System.out.println(mapping.getR2rmlMapping());

			String username = (mapping.getUser() == null || mapping.getUser().isEmpty()) ? "root" : mapping.getUser();
			String password = (mapping.getPassword() == null || mapping.getPassword().isEmpty()) ? "password" : mapping.getPassword();
			String connectionURL = (mapping.getConnectionURL() == null || mapping.getConnectionURL().isEmpty()) ? "jdbc:mysql://localhost:3306/jumar2rml" : mapping.getConnectionURL();

			Configuration configuration = new Configuration();
			configuration.setUser(username);
			configuration.setPassword(password);
			configuration.setConnectionURL(connectionURL);
			configuration.setMapping(mapping.getR2rmlMapping());
			R2RMLProcessor engine = new R2RMLProcessor(configuration);
			engine.execute();

			Model model = engine.getDataset().getDefaultModel();

			StringWriter stringWriter = new StringWriter();
			model.write(stringWriter, "TURTLE");
			output = stringWriter.toString();

			mappingExecution.setMapping(mapping.getR2rmlMapping());
			mappingExecution.setCreator(mapping.getCreator());
		} catch (Exception e) {
			StringWriter errors = new StringWriter();
			e.printStackTrace(new PrintWriter(errors));
			output = errors.toString();
		}

		mappingExecution.setOutput(output);
		session.save(mappingExecution);

		return mappingExecution;
	}

	void onSelectedFromRun() {
		run = true;
	}

	void onShowModal() {
		if (run)
			javaScriptSupport.addScript("$('#showModal').click();");
	}

}
