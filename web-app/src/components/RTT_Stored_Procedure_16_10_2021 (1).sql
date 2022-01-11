USE [Elective_Care_Publish]
GO

/****** Object:  StoredProcedure [dbo].[Build_RPT_Open_ASI_Combined_Pathways]    Script Date: 15/10/2021 15:16:05 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE procedure [dbo].[Build_RPT_Open_ASI_Combined_Pathways]
as


--Changes

--Andy Allen 16/10/21
--Change to source names for views, to provide script ahead of view name changes. 
--ie originally coded to [wl].[vw_National_Waiting_List_OpenPathways], however updated to future view name of wl.WLMDS_OpenPathways

--K/H 11/08/2021
--"Speciality" changed to use TFC code from UKHealth Dimentions
--Provider list changed to use dynamic list from UKHealth Dimentions
-- Changed source of Elective Waiting List Pathway to DEV view (Adds ASI Dataset) 
-- Changed source of ImportLogDetail to use Dev 

-- Max Data Date
declare @MAX_DATE datetime;
--SET @MAX_DATE = '2021-08-29'
--SET @MAX_DATE = ( SELECT TOP (1) MAX( [derWeekEnding] ) FROM [Elective_Care_Publish_Dev].[dbo].[ImportLogDetail] ) 
set @MAX_DATE =
(
    --select top (1) max([derWeekEnding])from [dbo].[ImportLogDetail]
	select top (1) max([derWeekEnding])from [wl].[ImportLogDetail]
);

-- OPCS temp table
select [Code]
into #TMP_OPCS
from [RAIDR_Reference].[dbo].[LU_OPCS];

-- Specialty temp table

select [Code]
into #TMP_SPEC
from
(
    select TFC.Main_Code_Text as [Code]
    from UK_Health_Dimensions.Data_Dictionary.Treatment_Function_Code_SCD as TFC
    where Is_Latest = 1
) SPEC;


--Previous logic
--SELECT
--	[Code]
--INTO
--#TMP_SPEC
--FROM
--	[RAIDR_Reference].[dbo].[LU_Specialty]
-----------------------------------------------------------------
-- Provider temp table


if object_id('tempdb..#TempOrgs1') is not null
    drop table #TempOrgs1;
select *
into #TempOrgs1
from
(
    select NHS.Organisation_Code
         , NHS.Organisation_Name
         , 'NHS_TRUST'                          as 'Type'
         , NHS.High_Level_Health_Authority_Code as 'System Code'
         , ODS.Name                             as 'System Name'
         , NHS.Parent_Organisation_Code         as 'Parent Org'
         , NHS.National_Grouping_Code
         , getdate()                            as 'Build_Date'
    from UK_Health_Dimensions.ODS.NHS_Trusts_SCD           as NHS
        left join [UK_Health_Dimensions].[ODS].[All_Codes] as ODS
            on NHS.High_Level_Health_Authority_Code = ODS.Code
               and ODS.ODS_API_Role_Name = 'STRATEGIC PARTNERSHIP'
    where NHS.Is_Latest = 1
          and NHS.Close_Date is null

    --==============================================================
    union all
    --==============================================================

    select ISP_PROV.Organisation_Code
         , ISP_PROV.Organisation_Name
         , 'ISP_Provider'                            as 'Type'
         , ISP_PROV.High_Level_Health_Authority_Code as 'System Code'
         , ODS.Name                                  as 'System Name'
         , ISP_PROV.Parent_Organisation_Code         as 'Parent Org'
         , ISP_PROV.National_Grouping_Code
         , getdate()                                 as 'Build_Date'
    from UK_Health_Dimensions.ODS.Ind_Healthcare_Providers_SCD as ISP_PROV
        left join [UK_Health_Dimensions].[ODS].[All_Codes]     as ODS
            on ISP_PROV.High_Level_Health_Authority_Code = ODS.Code
               and ODS.ODS_API_Role_Name = 'STRATEGIC PARTNERSHIP'
    where ISP_PROV.Is_Latest = 1
          and ISP_PROV.Close_Date is null

    --==============================================================
    union all
    --==============================================================

    select ISP_SITE.Organisation_Code
         , ISP_SITE.Organisation_Name
         , 'ISP_Site'                                as 'Type'
         , ISP_SITE.High_Level_Health_Authority_Code as 'System Code'
         , ODS.Name                                  as 'System Name'
         , ISP_SITE.Parent_Organisation_Code         as 'Parent Org'
         , ISP_SITE.National_Grouping_Code
         , getdate()                                 as 'Build_Date'
    from UK_Health_Dimensions.ODS.Ind_Healthcare_Provider_Sites_SCD as ISP_SITE
        left join [UK_Health_Dimensions].[ODS].[All_Codes]          as ODS
            on ISP_SITE.High_Level_Health_Authority_Code = ODS.Code
               and ODS.ODS_API_Role_Name = 'STRATEGIC PARTNERSHIP'
    where ISP_SITE.Is_Latest = 1
          and ISP_SITE.Close_Date is null
) as TempOrgs1;


if object_id('tempdb..#TempOrgs2') is not null
    drop table #TempOrgs2;
select *
into #TempOrgs2
from
(
    select A.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER as [ORGANISATION_IDENTIFIER_(CODE_OF_PROVIDER)]
         , A.ORGANISATION_SITE_IDENTIFIER_OF_TREATMENT as [ORGANISATION_SITE_IDENTIFIER_(OF_TREATMENT)]
         , case
               --If NHS, then report as NHS
               when ORG_PROV_CODE.Type = 'NHS_TRUST' then
                   A.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER
               --If ISP site as Provider, then use that
               when ORG_PROV_CODE.Type = 'ISP_Site' then
                   A.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER
               --If ISP Provider and ISP Site, use Site
               when ORG_PROV_CODE.Type = 'ISP_Provider'
                    and ORG_SITE_CODE.Type = 'ISP_Site' then
                   A.ORGANISATION_SITE_IDENTIFIER_OF_TREATMENT
               --If ISP Provider not  ISP Site, use Provider. OR IS NULL needed, due to SQL's attempt to handle NULLs...
               when ORG_PROV_CODE.Type = 'ISP_Provider'
                    and
                    (
                        ORG_SITE_CODE.Type <> 'ISP_Site'
                        or ORG_SITE_CODE.Type is null
                    ) then
                   A.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER
               --Captures where Org Code is not as above, but Site is ISP
               when ORG_SITE_CODE.Type = 'ISP_Site' then
                   A.ORGANISATION_SITE_IDENTIFIER_OF_TREATMENT
               else
                   '*Check'
           end      as 'Reporting Organisation'
         , count(*) as 'MDS Records'
    --from [dbo].[vw_Open_ASI_Combined_Pathways] as A
        --FROM [Elective_Care_Publish_Dev].[dbo].[vw_Open_ASI_Combined_Pathways] AS A
		 --AA 18/10/21 change
		 --FROM [Elective_Care_Publish].[wl].[vw_Open_ASI_Combined_Pathways] AS A
		 FROM wl.WLMDS_Open_ASI_Combined AS A

        left join #TempOrgs1                   as ORG_PROV_CODE
            on A.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER = ORG_PROV_CODE.Organisation_Code
        left join #TempOrgs1                   as ORG_SITE_CODE
            on A.ORGANISATION_SITE_IDENTIFIER_OF_TREATMENT = ORG_SITE_CODE.Organisation_Code
    where A.derWeekEnding =
    (
        select max(A.derWeekEnding)
      --  from [dbo].[vw_Open_ASI_Combined_Pathways] as A
	  	 --AA 18/10/21 change
		--FROM [wl].[vw_Open_ASI_Combined_Pathways] as A
		FROM wl.WLMDS_Open_ASI_Combined AS A
    )
    --A.derWeekEnding = (SELECT MAX(A.derWeekEnding) FROM [Elective_Care_Publish_Dev].[dbo].[vw_Open_ASI_Combined_Pathways] AS A)

    group by A.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER
           , A.ORGANISATION_SITE_IDENTIFIER_OF_TREATMENT
           , case
                 --If NHS, then report as NHS
                 when ORG_PROV_CODE.Type = 'NHS_TRUST' then
                     A.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER
                 --If ISP site as Provider, then use that
                 when ORG_PROV_CODE.Type = 'ISP_Site' then
                     A.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER
                 --If ISP Provider and ISP Site, use Site
                 when ORG_PROV_CODE.Type = 'ISP_Provider'
                      and ORG_SITE_CODE.Type = 'ISP_Site' then
                     A.ORGANISATION_SITE_IDENTIFIER_OF_TREATMENT
                 --If ISP Provider not  ISP Site, use Provider. OR IS NULL needed, due to SQL's attempt to handle NULLs...
                 when ORG_PROV_CODE.Type = 'ISP_Provider'
                      and
                      (
                          ORG_SITE_CODE.Type <> 'ISP_Site'
                          or ORG_SITE_CODE.Type is null
                      ) then
                     A.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER
                 --Captures where Org Code is not as above, but Site is ISP
                 when ORG_SITE_CODE.Type = 'ISP_Site' then
                     A.ORGANISATION_SITE_IDENTIFIER_OF_TREATMENT
                 else
                     '*Check'
             end
) as TempOrgs2;


select *
into #TMP_ORGS
from
(
    select distinct
           [Reporting Organisation]
    -- as [Reporting Organisation]
    from #TempOrgs2                                                                     as ORG
        left join #TempOrgs1                                                            as ORG1
            on ORG.[Reporting Organisation] = ORG1.Organisation_Code
        left join [UK_Health_Dimensions].[ODS].[NHS_England_Region_Names_And_Codes_SCD] as NHSE
            on ORG1.National_Grouping_Code = NHSE.NHS_England_Region_Code
               and NHSE.Is_Latest = 1
) a;

truncate table [dbo].[RPT_Open_ASI_Combined_Pathways];

-- Elective Care Waiting List

insert into [dbo].[RPT_Open_ASI_Combined_Pathways]
(
    [rowId]
  , [Admitted]
  , [NHS Number]
  , [Age]
  , [Provider Code]
  , [ORGANISATION_IDENTIFIER_(CODE_OF_PROVIDER)]
  , [Specialty Code]
  , [OPCS Code]
  , [Clinical Priority]
  , [Inclusion On Cancer PTL]
  , [Consultant Code]
  , [Week Ending]
  , [Days Waiting]
  , [Weeks Waiting]
  , [RTT Data]
  , [Non-RTT Data]
  , [P2 Clearance Time]
  , [Weeks Range]
)
select OP.*
     --,CASE WHEN OP.[Weeks Waiting] < 1 THEN 1 ELSE ( CASE WHEN OP.[Weeks Waiting] > 104 THEN 105 ELSE CEILING( OP.[Weeks Waiting] ) END ) END AS [Weeks Range]

     , case
           when OP.[Weeks Waiting] = 'UCS' then [Weeks Waiting]
		   when OP.[Weeks Waiting] = 'SDR' then [Weeks Waiting]
           when cast(OP.[Weeks Waiting] as float) < 1 then
               '1'
           else
     (case
          when cast(OP.[Weeks Waiting] as float) > 104 then
              '105'
          else
              cast(ceiling(cast(OP.[Weeks Waiting] as float)) as nvarchar(255))
      end
     )
       end as [Weeks Range]
from
(
    select derRowId as [rowId]
         , case
               when [Waiting_List_Type] in ( 'PTLI', 'IRTT', 'INON' ) then
                   1
               else
                   0
           end                                                  as [Admitted]
         , case
               when [NHS_NUMBER] is null then
                   'UNKNOWN'
               else
                   [NHS_NUMBER]
           end                                                  as [NHS Number]
         , datediff(year, [PERSON_BIRTH_DATE], [derWeekEnding]) as [Age]
         --,CASE 
         --WHEN ( [ORGANISATION_SITE_IDENTIFIER_(OF_TREATMENT)] IN (SELECT distinct [Reporting Organisation]  FROM #TMP_ORGS ) )THEN [ORGANISATION_SITE_IDENTIFIER_(OF_TREATMENT)]
         --WHEN ( [ORGANISATION_IDENTIFIER_(CODE_OF_PROVIDER)] IN (SELECT distinct [Reporting Organisation]  FROM #TMP_ORGS ) )THEN [ORGANISATION_IDENTIFIER_(CODE_OF_PROVIDER)]		
         --ELSE 'OTHER' END AS [Provider Code]
         , case
               when Prov.[Reporting Organisation] is null then
                   a.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER
               else
                   Prov.[Reporting Organisation]
           end                                                  as [Provider Code]
         , a.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER
         , case
               when ([ACTIVITY_TREATMENT_FUNCTION_CODE] in
                     (
                         select [Code] from #TMP_SPEC
                     )
                    ) then
                   [ACTIVITY_TREATMENT_FUNCTION_CODE]
               else
                   'OTHER'
           end                                                  as [Specialty Code]
         , case
               when ([Proposed_Procedure_OPCS_Code] in
                     (
                         select [Code] from #TMP_OPCS
                     )
                    ) then
                   [Proposed_Procedure_OPCS_Code]
               else
                   'OTHER'
           end                                                  as [OPCS Code]
         , case
               when [Procedure_Priority_Code] in ( 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'p1', 'p2', 'p3', 'p4', 'p5'
                                                 , 'p6', '1', '2', '3', '4', '5', '6'
                                                 ) then
                   [Procedure_Priority_Code]
               else
                   'OTHER'
           end                                                  as [Clinical Priority]
         , case
               when upper([Inclusion_On_Cancer_PTL]) = 'YES' then
                   1
               else
                   0
           end                                                  as [Inclusion On Cancer PTL]
         , case
               when [CONSULTANT_CODE] is null then
                   'UNKNOWN'
               else
                   [CONSULTANT_CODE]
           end                                                  as [Consultant Code]
         , [derWeekEnding]                                      as [Week Ending]
         --,CASE WHEN [REFERRAL_TO_TREATMENT_PERIOD_START_DATE] is NULL THEN 0 ELSE ( DATEDIFF( DAY, [REFERRAL_TO_TREATMENT_PERIOD_START_DATE], [derWeekEnding] ) ) END AS [Days Waiting]
         --,CASE WHEN [REFERRAL_TO_TREATMENT_PERIOD_START_DATE] is NULL THEN 0 ELSE ( DATEDIFF( DAY, [REFERRAL_TO_TREATMENT_PERIOD_START_DATE], [derWeekEnding] ) / 7.00 ) END AS [Weeks Waiting]
         , case 
			when [REFERRAL_TO_TREATMENT_PERIOD_START_DATE] is null then 'UCS'
			when [REFERRAL_TO_TREATMENT_PERIOD_START_DATE] = '1900-01-01' then 'SDR' 
			when [REFERRAL_TO_TREATMENT_PERIOD_START_DATE] >  @MAX_DATE then 'SDR'
			else cast((datediff(day, [REFERRAL_TO_TREATMENT_PERIOD_START_DATE], [derWeekEnding])) as nvarchar(255)) 
			end as [Days Waiting]
         , case 
			when [REFERRAL_TO_TREATMENT_PERIOD_START_DATE] is null then 'UCS'
			when [REFERRAL_TO_TREATMENT_PERIOD_START_DATE] = '1900-01-01' then 'SDR'
			when [REFERRAL_TO_TREATMENT_PERIOD_START_DATE] >  @MAX_DATE then 'SDR'
			else cast(ceiling((datediff(day, [REFERRAL_TO_TREATMENT_PERIOD_START_DATE], [derWeekEnding]) / 7.00)) as nvarchar(255)) 
			end as [Weeks Waiting]
         , case
               when [Waiting_List_Type] in ( 'IRTT', 'ORTT' ) then
                   1
               else
                   0
           end                                                  as [RTT Data]
         , case
               when [Waiting_List_Type] in ( 'INON', 'ONON' ) then
                   1
               else
                   0
           end                                                  as [Non-RTT Data]
         , case
               when
               (
                   [Procedure_Priority_Code] in ( 'P2', 'p2', '2' )
                   and [Date_Of_Last_Priority_Review] is not null
                   and [Date_Of_Last_Priority_Review] <> '1900-01-01'
                   and [Date_Of_Last_Priority_Review] <= [derWeekEnding]
               ) then
                   ceiling(datediff(day, [Date_Of_Last_Priority_Review], [derWeekEnding]) / 7.00)
               else
                   null
           end                                                  as [P2 Clearance Time]
    --from [dbo].[vw_Open_ASI_Combined_Pathways] a
	--AA 18/10/21 Change
	--from [Elective_Care_Publish].[wl].[vw_Open_ASI_Combined_Pathways] a
	FROM wl.WLMDS_Open_ASI_Combined a
        --[Elective_Care_Publish_Dev].[dbo].[vw_Open_ASI_Combined_Pathways]

        left join #TempOrgs2                   Prov
            on a.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER = Prov.[ORGANISATION_IDENTIFIER_(CODE_OF_PROVIDER)]
               and a.ORGANISATION_SITE_IDENTIFIER_OF_TREATMENT = Prov.[ORGANISATION_SITE_IDENTIFIER_(OF_TREATMENT)]
    where [derWeekEnding] = @MAX_DATE
          and [Waiting_List_Type] in ( 'ORTT', 'IRTT', 'ONON', 'INON' )
          and case
                  when (a.ORGANISATION_SITE_IDENTIFIER_OF_TREATMENT in
                        (
                            select distinct [Reporting Organisation] from #TMP_ORGS
                        )
                       ) then
                      a.ORGANISATION_SITE_IDENTIFIER_OF_TREATMENT
                  when (a.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER in
                        (
                            select distinct [Reporting Organisation] from #TMP_ORGS
                        )
                       ) then
                      a.ORGANISATION_IDENTIFIER_CODE_OF_PROVIDER
                  else
                      'OTHER'
              end != 'other'
) OP;

drop table #TMP_OPCS;
drop table #TMP_SPEC;
drop table #TMP_ORGS;
GO


