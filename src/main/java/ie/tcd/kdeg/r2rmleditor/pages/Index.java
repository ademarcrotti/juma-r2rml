package ie.tcd.kdeg.r2rmleditor.pages;

import java.util.List;

import org.apache.tapestry5.annotations.Property;
import org.apache.tapestry5.hibernate.annotations.CommitAfter;
import org.apache.tapestry5.ioc.annotations.Inject;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import ie.tcd.kdeg.r2rmleditor.entities.Mapping;

public class Index extends BasePage {

	@Property
	private Mapping newMapping;

	@Property
	private Mapping mapping;

	@Inject
	private Session session;
	
	@CommitAfter
	public String onActivate() {
		if(!securityService.isAuthenticated()) {
			return "login";
		}
		return null;
	}
	
	@CommitAfter
	public void onSuccess() {
		newMapping.setCreator(getUsername());
		session.persist(newMapping);
	}

	@SuppressWarnings("unchecked")
	public List<Mapping> getMappings() {
		return session.createCriteria(Mapping.class)
				.add(Restrictions.eq("creator", getUsername()))
				.list();
	}
	
}
