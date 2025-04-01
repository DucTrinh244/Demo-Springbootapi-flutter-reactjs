package com.ManagementProject.demoManagementProject.Models;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "risks")
public class Risk {

    @Id
    private String riskId;
    private String projectId;
    private String riskDescription;
    private String probability;
    private String impact;
    private String mitigationPlan;

}
